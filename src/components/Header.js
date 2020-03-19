import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants'

class Header extends Component {
	render() {
		const authToken = localStorage.getItem(AUTH_TOKEN)
		return (
			<div className='flex pa1 justify-between nowrap orange'>
				<div className='flex flex-fixed black'>
					<div className='fw7 mr1'>爆炸新闻</div>
					<Link to='/' className='ml1 no-underline black'>
						新闻
					</Link>
					<div className='ml1'>|</div>
					<Link to='/top' className='ml1 no-underline black'>
						头条
					</Link>
					<div className='ml1'>|</div>
					<Link to='/search' className='ml1 no-underline black'>
						搜索
					</Link>
					{authToken && (
						<div className='flex'>
							<div className='ml1'>|</div>
							<Link to='/create' className='ml1 no-underline black'>
								创建
							</Link>
						</div>
					)}
				</div>
				<div className='flex flex-fixed'>
					{authToken ? (
						<div
							className='ml1 pointer black'
							onClick={() => {
								localStorage.removeItem(AUTH_TOKEN)
								this.props.history.push(`/`)
							}}
						>
							退出
						</div>
					) : (
						<Link to='/login' className='ml1 no-underline black'>
							登录
						</Link>
					)}
				</div>
			</div>
		)
	}
}

export default withRouter(Header)
