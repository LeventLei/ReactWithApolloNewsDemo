import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

// 注册
const SIGNUP_MUTATION = gql`
	mutation SignupMutation($email: String!, $password: String!, $name: String!) {
		signup(email: $email, password: $password, name: $name) {
			token
		}
	}
`

// 登录
const LOGIN_MUTATION = gql`
	mutation LoginMutation($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
		}
	}
`

class Login extends Component {
	state = {
		login: true, // 用来切换登录和注册功能
		email: '',
		password: '',
		name: ''
	}

	render() {
		const { login, email, password, name } = this.state
		return (
			<div>
				<h4 className='mv3'>{login ? '登录' : '注册'}</h4>
				<div className='flex flex-column'>
					{!login && (
						<input
							value={name}
							onChange={e => this.setState({ name: e.target.value })}
							type='text'
							placeholder='请输入您的昵称'
						/>
					)}
					<input
						value={email}
						onChange={e => this.setState({ email: e.target.value })}
						type='text'
						placeholder='请输入您的邮箱'
					/>
					<input
						value={password}
						onChange={e => this.setState({ password: e.target.value })}
						type='password'
						placeholder='请输入您的密码'
					/>
				</div>
				<div className='flex mt3'>
					<Mutation
						mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
						variables={{ email, password, name }}
						onCompleted={data => this._confirm(data)}
					>
						{mutation => (
							<div className='pointer mr2 button' onClick={mutation}>
								{login ? '登录' : '注册'}
							</div>
						)}
					</Mutation>

					<div
						className='pointer button'
						onClick={() => this.setState({ login: !login })}
					>
						{login ? '创建新账号？' : '已有账号，前往登录'}
					</div>
				</div>
			</div>
		)
	}

	_confirm = async data => {
		const { token } = this.state.login ? data.login : data.signup
		this._saveUserData(token)
		this.props.history.push(`/`)
	}

	_saveUserData = token => {
		localStorage.setItem(AUTH_TOKEN, token)
	}
}

export default Login
