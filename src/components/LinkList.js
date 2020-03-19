import React, { Component, Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'
import { LINKS_PER_PAGE } from '../constants'

// 获取links
export const FEED_QUERY = gql`
	query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
		feed(first: $first, skip: $skip, orderBy: $orderBy) {
			links {
				id
				createdAt
				url
				description
				postedBy {
					id
					name
				}
				votes {
					id
					user {
						id
					}
				}
			}
			count
		}
	}
`

// 订阅新增新闻
const NEW_LINKS_SUBSCRIPTION = gql`
	subscription {
		newLink {
			id
			url
			description
			createdAt
			postedBy {
				id
				name
			}
			votes {
				id
				user {
					id
				}
			}
		}
	}
`

// 订阅新增点赞
const NEW_VOTES_SUBSCRIPTION = gql`
	subscription {
		newVote {
			id
			link {
				id
				url
				description
				createdAt
				postedBy {
					id
					name
				}
				votes {
					id
					user {
						id
					}
				}
			}
			user {
				id
			}
		}
	}
`

class LinkList extends Component {
	// 点赞后实时更新
	_updateCacheAfterVote = (store, createVote, linkId) => {
		const isNewPage = this.props.location.pathname.includes('new')
		const page = parseInt(this.props.match.params.page, 10)
		const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
		const first = isNewPage ? LINKS_PER_PAGE : 100
		const orderBy = isNewPage ? 'createdAt_DESC' : null
		const data = store.readQuery({
			query: FEED_QUERY,
			variables: { first, skip, orderBy }
		})
		const votedLink = data.feed.links.find(link => link.id === linkId)
		votedLink.votes = createVote.link.votes
		store.writeQuery({ query: FEED_QUERY, data })
	}

	// 订阅新增新闻
	_subscribeToNewLinks = subscribeToMore => {
		subscribeToMore({
			document: NEW_LINKS_SUBSCRIPTION,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev
				const newLink = subscriptionData.data.newLink
				const exists = prev.feed.links.find(({ id }) => id === newLink.id)
				if (exists) return prev
				return Object.assign({}, prev, {
					feed: {
						links: [newLink, ...prev.feed.links],
						count: prev.feed.links.length + 1,
						__typename: prev.feed.__typename
					}
				})
			}
		})
	}

	// 订阅新增点赞
	_subscribeToNewVotes = subscribeToMore => {
		subscribeToMore({
			document: NEW_VOTES_SUBSCRIPTION
		})
	}

	// 获取分页所需参数
	_getQueryVariables = () => {
		const isNewPage = this.props.location.pathname.includes('new')
		const page = parseInt(this.props.match.params.page, 10)
		const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
		const first = isNewPage ? LINKS_PER_PAGE : 100
		const orderBy = isNewPage ? 'createdAt_DESC' : null
		return { first, skip, orderBy }
	}

	// 计算哪些新闻链接将被展示
	_getLinksToRender = data => {
		const isNewPage = this.props.location.pathname.includes('new')
		if (isNewPage) {
			return data.feed.links
		}
		const rankedLinks = data.feed.links.slice()
		rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
		return rankedLinks
	}

	// 后一页
	_nextPage = data => {
		const page = parseInt(this.props.match.params.page, 10)
		if (page <= data.feed.count / LINKS_PER_PAGE) {
			const nextPage = page + 1
			this.props.history.push(`/new/${nextPage}`)
		}
	}

	// 前一页
	_previousPage = () => {
		const page = parseInt(this.props.match.params.page, 10)
		if (page > 1) {
			const previousPage = page - 1
			this.props.history.push(`/new/${previousPage}`)
		}
	}

	render() {
		return (
			<Query query={FEED_QUERY} variables={this._getQueryVariables()}>
				{({ loading, error, data, subscribeToMore }) => {
					if (loading) return <div>加载中，请稍等...</div>
					if (error) return <div>抱歉，出错了</div>
					this._subscribeToNewLinks(subscribeToMore)
					this._subscribeToNewVotes(subscribeToMore)
					const linksToRender = this._getLinksToRender(data)
					const isNewPage = this.props.location.pathname.includes('new')
					const pageIndex = this.props.match.params.page
						? (this.props.match.params.page - 1) * LINKS_PER_PAGE
						: 0

					return (
						<Fragment>
							{linksToRender.map((link, index) => (
								<Link
									key={link.id}
									link={link}
									index={index + pageIndex}
									updateStoreAfterVote={this._updateCacheAfterVote}
								/>
							))}
							{isNewPage && (
								<div className='flex ml4 mv3 gray'>
									<div className='pointer mr2' onClick={this._previousPage}>
										上一页
									</div>
									<div className='pointer' onClick={() => this._nextPage(data)}>
										下一页
									</div>
								</div>
							)}
						</Fragment>
					)
				}}
			</Query>
		)
	}
}

export default LinkList
