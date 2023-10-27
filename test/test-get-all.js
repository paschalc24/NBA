import { test } from 'node:test'
import assert from 'node:assert/strict'
import 'dotenv/config';

test('Get All Responding Correctly', async () => {
    const response = await fetch('http://localhost:3000/simulations/all', {
        method: 'GET',
        headers: {
            'apiKey': process.env.API_KEY
        }
    })
    const data = await response.json()
    assert.equal(typeof(data), 'object')
    assert.equal(response.status, 200)
})

test('Get All Responding Correctly Without API Key', async () => {
    const response = await fetch('http://localhost:3000/simulations/all')
    assert.equal(response.status, 401)
})