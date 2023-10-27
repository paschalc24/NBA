import { test } from 'node:test'
import assert from 'node:assert/strict'
import 'dotenv/config';

test('Post Responding Correctly', async () => {
    const response = await fetch('http://localhost:3000/simulations/mvLinearRegression/celtics/jazz', {
        method: 'POST',
        headers: {
            'apiKey': process.env.API_KEY
        }
    })
    const data = await response.json()
    assert.equal(typeof(data), 'object')
    assert.equal(response.status, 200)
})

test('Post Responding Correctly Without Incorrect Input', async () => {
    const response = await fetch('http://localhost:3000/simulations/mvLinearRegression/1/celtics', {
        method: 'POST',
        headers: {
            'apiKey': process.env.API_KEY
        }
    })
    assert.equal(response.status, 500)
})