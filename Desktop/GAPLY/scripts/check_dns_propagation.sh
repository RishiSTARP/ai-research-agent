#!/bin/bash

echo "🔍 Checking DNS propagation for gaply.in..."
echo "================================================"

# Check if domain is using Cloudflare nameservers
echo "📡 Checking nameservers..."
nslookup -type=NS gaply.in

echo ""
echo "🌐 Checking if domain is accessible..."
curl -s -I https://gaply.in/health || echo "❌ Domain not yet accessible"

echo ""
echo "⏰ This may take 5-15 minutes to fully propagate."
echo "🔄 Run this script again in a few minutes to check progress."
