#!/usr/bin/env python3
"""
Network connectivity test script for BoneHealth AI Backend
This script helps debug network and API connectivity issues.
"""

import requests
import json
import time
import sys

def test_local_api():
    """Test the local API"""
    print("🔍 Testing Local API...")
    
    local_url = "http://localhost:8000"
    
    # Test health endpoint
    try:
        response = requests.get(f"{local_url}/health", timeout=10)
        print(f"✅ Health check: {response.status_code} - {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test prediction endpoint
    test_data = {
        "Age": 65,
        "Gender": "Female",
        "Hormonal_Changes": "Postmenopausal",
        "Family_History": "Yes",
        "Race_Ethnicity": "White",
        "Body_Weight": "Normal",
        "Calcium_Intake": "Low",
        "Vitamin_D_Intake": "Insufficient",
        "Physical_Activity": "Sedentary",
        "Smoking": "No",
        "Alcohol_Consumption": "None",
        "Medical_Conditions": "None",
        "Medications": "None",
        "Prior_Fractures": "No"
    }
    
    try:
        response = requests.post(
            f"{local_url}/api/predict",
            json=test_data,
            timeout=30
        )
        print(f"✅ Prediction: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   Probability: {result.get('probability', 'N/A')}")
            print(f"   Deployment: {result.get('deployment', 'N/A')}")
        else:
            print(f"   Error: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Prediction failed: {e}")
        return False
    
    return True

def test_vercel_api(vercel_url):
    """Test the Vercel API"""
    print(f"\n🌐 Testing Vercel API: {vercel_url}")
    
    # Test health endpoint
    try:
        response = requests.get(f"{vercel_url}/health", timeout=10)
        print(f"✅ Health check: {response.status_code} - {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test prediction endpoint
    test_data = {
        "Age": 65,
        "Gender": "Female",
        "Hormonal_Changes": "Postmenopausal",
        "Family_History": "Yes",
        "Race_Ethnicity": "White",
        "Body_Weight": "Normal",
        "Calcium_Intake": "Low",
        "Vitamin_D_Intake": "Insufficient",
        "Physical_Activity": "Sedentary",
        "Smoking": "No",
        "Alcohol_Consumption": "None",
        "Medical_Conditions": "None",
        "Medications": "None",
        "Prior_Fractures": "No"
    }
    
    try:
        response = requests.post(
            f"{vercel_url}/api/predict",
            json=test_data,
            timeout=30
        )
        print(f"✅ Prediction: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"   Probability: {result.get('probability', 'N/A')}")
            print(f"   Deployment: {result.get('deployment', 'N/A')}")
        else:
            print(f"   Error: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Prediction failed: {e}")
        return False
    
    return True

def test_network_connectivity():
    """Test basic network connectivity"""
    print("🌍 Testing Network Connectivity...")
    
    test_urls = [
        "https://httpbin.org/get",
        "https://api.github.com",
        "https://vercel.com"
    ]
    
    for url in test_urls:
        try:
            response = requests.get(url, timeout=10)
            print(f"✅ {url}: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ {url}: {e}")

def main():
    print("🚀 BoneHealth AI Backend Network Test")
    print("=" * 50)
    
    # Test network connectivity first
    test_network_connectivity()
    
    # Test local API
    local_success = test_local_api()
    
    # Test Vercel API if URL provided
    if len(sys.argv) > 1:
        vercel_url = sys.argv[1]
        vercel_success = test_vercel_api(vercel_url)
    else:
        print("\n💡 To test Vercel API, run:")
        print("   python test_network.py https://your-project.vercel.app")
        vercel_success = None
    
    # Summary
    print("\n📊 Test Summary:")
    print("=" * 50)
    print(f"Local API: {'✅ Working' if local_success else '❌ Failed'}")
    if vercel_success is not None:
        print(f"Vercel API: {'✅ Working' if vercel_success else '❌ Failed'}")
    
    # Troubleshooting tips
    print("\n🔧 Troubleshooting Tips:")
    if not local_success:
        print("• Make sure your local backend is running: python -m uvicorn api:app --host 0.0.0.0 --port 8000")
        print("• Check if port 8000 is available: lsof -i :8000")
        print("• Verify your firewall settings")
    
    if vercel_success is False:
        print("• Check your Vercel deployment status")
        print("• Verify the Vercel URL is correct")
        print("• Check Vercel function logs: vercel logs")
        print("• Ensure all dependencies are in requirements-vercel.txt")

if __name__ == "__main__":
    main() 