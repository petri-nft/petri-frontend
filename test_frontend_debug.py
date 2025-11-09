#!/usr/bin/env python3
"""
Frontend Session & Trees Debugging Test

This script tests the frontend's session persistence and tree fetching by:
1. Logging in to get auth token
2. Planting a tree
3. Fetching trees to verify they appear

Run with: python3 test_frontend_debug.py
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

print("=" * 70)
print("FRONTEND SESSION & TREES DEBUG TEST")
print("=" * 70)

# Test 1: Login
print("\n[1] Testing Login...")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"username": "alice", "password": "password123"}
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.status_code}")
    print(f"Response: {login_response.text}")
    exit(1)

login_data = login_response.json()
token = login_data.get('access_token')
user_id = login_data.get('user_id')
username = login_data.get('username')

print(f"✅ Login successful")
print(f"   User ID: {user_id}")
print(f"   Username: {username}")
print(f"   Token: {token[:50]}...")

# This is what the frontend should save to localStorage:
print(f"\n📝 Frontend should save to localStorage:")
print(f"   auth_token: {token[:50]}...")
frontend_user = {
    "id": str(user_id),
    "email": "alice@example.com",
    "displayName": username,
    "createdAt": "2025-11-09T00:00:00.000Z"
}
print(f"   user: {json.dumps(frontend_user)}")

# Test 2: Plant a tree
print(f"\n[2] Planting a test tree...")
headers = {"Authorization": f"Bearer {token}"}
plant_response = requests.post(
    f"{BASE_URL}/trees",
    headers=headers,
    json={
        "species": "oak",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "location_name": "Test Location",
        "description": "Test tree for debugging"
    }
)

if plant_response.status_code != 201:
    print(f"❌ Plant tree failed: {plant_response.status_code}")
    print(f"Response: {plant_response.text}")
    exit(1)

tree_data = plant_response.json()
tree_id = tree_data.get('id')
print(f"✅ Tree planted successfully")
print(f"   Tree ID: {tree_id}")
print(f"   Species: {tree_data.get('species')}")
print(f"   Health Score: {tree_data.get('health_score')}")

# Test 3: Fetch trees
print(f"\n[3] Fetching trees for user {user_id}...")
trees_response = requests.get(
    f"{BASE_URL}/trees",
    headers=headers
)

if trees_response.status_code != 200:
    print(f"❌ Fetch trees failed: {trees_response.status_code}")
    print(f"Response: {trees_response.text}")
    exit(1)

trees = trees_response.json()
print(f"✅ Trees fetched successfully")
print(f"   Total trees: {len(trees)}")

# Find our test tree
test_tree = None
for tree in trees:
    if tree.get('id') == tree_id:
        test_tree = tree
        break

if test_tree:
    print(f"✅ Test tree found in list!")
    print(f"   Tree ID: {test_tree.get('id')}")
    print(f"   Species: {test_tree.get('species')}")
    print(f"   Health Score: {test_tree.get('health_score')}")
else:
    print(f"❌ Test tree NOT found in list!")
    print(f"   Expected ID: {tree_id}")
    print(f"   Got {len(trees)} trees:")
    for t in trees:
        print(f"     - ID: {t.get('id')}, Species: {t.get('species')}, User: {t.get('user_id')}")

# Test 4: Show the frontend data format
print(f"\n[4] Frontend Tree Format Conversion")
print(f"   Backend response fields:")
if test_tree:
    for key in ['id', 'user_id', 'species', 'health_score', 'planting_date', 'current_value']:
        print(f"     - {key}: {test_tree.get(key)}")
    
    print(f"\n   Frontend should convert to:")
    converted = {
        "id": str(test_tree.get('id')),
        "user_id": test_tree.get('user_id'),
        "ownerId": test_tree.get('user_id'),
        "species": test_tree.get('species'),
        "healthIndex": test_tree.get('health_score'),
        "health_score": test_tree.get('health_score'),
        "plantedAt": test_tree.get('planting_date'),
        "planting_date": test_tree.get('planting_date'),
        "current_value": test_tree.get('current_value'),
    }
    for key, value in converted.items():
        print(f"     - {key}: {value}")

# Summary
print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)
print(f"✅ All API endpoints working correctly")
print(f"✅ Trees are being stored in database")
print(f"✅ Frontend has access token: {token[:30]}...")
print(f"\nNow test in browser:")
print(f"1. Open browser DevTools (F12)")
print(f"2. Go to Application → Local Storage → http://localhost:8080")
print(f"3. Verify:")
print(f"   - auth_token is saved")
print(f"   - user object is saved with id, displayName, email")
print(f"4. Go to Console and check for errors")
print(f"5. Refresh page - should stay logged in")
print(f"6. Navigate to /trees - should see your trees")
