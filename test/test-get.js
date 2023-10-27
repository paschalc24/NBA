import { test } from 'node:test'
import assert from 'node:assert/strict'
import 'dotenv/config';

test('Get Simulation by ID Responding Correctly (Simulation Exists)', async () => {
    const response = await fetch('http://localhost:3000/simulations/4f1179b3-b376-4ac4-86cf-46a83d7cc4f1', {
        method: 'GET',
        headers: {
            'apiKey': process.env.API_KEY
        }
    })
    assert.equal(response.status, 200)
})

test('Get Simulation by ID Responding Correctly (Simulation Does Not Exist)', async () => {
    const response = await fetch('http://localhost:3000/simulations/e1983743-ec7a-46a8', {
        method: 'GET',
        headers: {
            'apiKey': process.env.API_KEY
        }
    })
    assert.equal(response.status, 404)
})