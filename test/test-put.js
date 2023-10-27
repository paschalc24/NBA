import { test } from 'node:test'
import assert from 'node:assert/strict'
import 'dotenv/config';

test('Put Responding Correctly (Simulation Exists)', async () => {
    const testPut = {
        "id": "8461ceec-e7d0-4e3d-9d97-3498b351a610",
        "celtics": [
            120
        ],
        "hawks": [
            120
        ]
    }
    const response = await fetch('http://localhost:3000/simulations/8461ceec-e7d0-4e3d-9d97-3498b351a610', {
        method: 'PUT',
        headers: {
            'apiKey': process.env.API_KEY
        },
        body: JSON.stringify(testPut)
    })
    const data = await response.json()
    assert.equal(typeof(data), 'object')
    assert.equal(response.status, 200)
})

test('Put Responding Correctly (Simulation Does Not Exist)', async () => {
    const testPut = {
        "id": "8461ceec-e7d0",
        "celtics": [
            120
        ],
        "hawks": [
            120
        ]
    }
    const response = await fetch('http://localhost:3000/simulations/8461ceec-e7d0', {
        method: 'PUT',
        headers: {
            'apiKey': process.env.API_KEY
        },
        body: JSON.stringify(testPut)
    })
    assert.equal(response.status, 404)
})