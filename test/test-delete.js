import { test } from 'node:test'
import assert from 'node:assert/strict'
import 'dotenv/config';

test('Delete Simulation Responding Correctly (Simulation Exists)', async () => {
    const response = await fetch('http://localhost:3000/simulations/0dc1579b-9b39-4d8a-b4fa-3319278f541e', {
        method: 'DELETE',
        headers: {
            'apiKey': process.env.API_KEY
        }
    })
    assert.equal(response.status, 204)
})

test('Delete Simulation Responding Correctly (Simulation Does Not Exist)', async () => {
    const response = await fetch('http://localhost:3000/simulations/0dc1579b-9b39-4d8a-b4fa-3319278f541e', {
        method: 'DELETE',
        headers: {
            'apiKey': process.env.API_KEY
        }
    })
    assert.equal(response.status, 404)
})