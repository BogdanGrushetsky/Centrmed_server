const userService = require('../service/user-service')
const { start, app, closeFunc } = require('../index')
const request = require('supertest')
let application

beforeAll(async () => {
	await start()
	application = app
})
const newUser = {
	email: '6@gmail.com',
	password: 'password'
}


describe('Users e2e', () => {
	it('login', async () => {
		const res = await request(app)
			.post('/api/login')
			.send({ email: newUser.email, password: newUser.password })
		expect(200)
	})
})


// const newUser = {
// 	email: '7@gmail.com',
// 	password: 'password '
// }

// describe('User Service', () => {
// 	it('createUser', async () => {
// 		const createdUser = await userService.login(
// 			newUser.email,
// 			newUser.password
// 		)
// 		expect(createdUser.user.email).toEqual(newUser.email)
// 		expect(createdUser.user.password).not.toEqual(newUser.password)
// 	})
// })
