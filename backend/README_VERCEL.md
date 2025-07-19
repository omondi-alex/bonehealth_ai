# BoneHealth AI Backend - Vercel Deployment Guide

This guide will help you deploy your FastAPI backend on Vercel for reliable, serverless predictions.

## 🚀 Quick Deploy

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Set the root directory to `bonehealth_ai/backend`
   - Deploy!

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd bonehealth_ai/backend
   vercel
   ```

## 📁 Vercel Configuration Files

### `vercel.json`
- Configures the Python runtime
- Sets up routing for all requests to `api.py`
- Sets function timeout to 30 seconds
- Configures environment variables

### `api_vercel.py`
- Vercel-optimized version of your API
- Uses synthetic data generation (no file system dependency)
- Includes health check endpoints
- Optimized for serverless execution

### `requirements-vercel.txt`
- Lightweight dependencies for Vercel
- Optimized versions for serverless deployment

## 🔧 Key Differences for Vercel

### 1. **No File System Access**
- Vercel functions are stateless
- Can't read CSV files from disk
- Solution: Generate synthetic data in-memory

### 2. **Cold Starts**
- Functions may take time to start
- Solution: Optimized imports and lightweight dependencies

### 3. **Function Timeout**
- Limited to 30 seconds (Hobby plan)
- Solution: Efficient algorithms and data generation

### 4. **Memory Limits**
- Limited memory per function
- Solution: Smaller datasets and optimized models

## 📊 API Endpoints

Once deployed, your API will be available at:
- **Base URL:** `https://your-project.vercel.app`
- **API Docs:** `https://your-project.vercel.app/docs`
- **Health Check:** `https://your-project.vercel.app/health`
- **Root:** `https://your-project.vercel.app/`

### Available Endpoints:

1. **GET /** - API information
2. **GET /health** - Health check
3. **POST /api/predict** - Osteoporosis prediction
4. **GET /api/data-science-metrics** - Model metrics
5. **GET /docs** - Interactive API documentation

## 🧪 Testing Your Deployment

### Test the Health Endpoint:
```bash
curl https://your-project.vercel.app/health
```

### Test a Prediction:
```bash
curl -X POST https://your-project.vercel.app/api/predict \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

## 🔄 Continuous Deployment

### Automatic Deployments
- Every push to `main` branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on failures

### Environment Variables
Set these in Vercel dashboard:
```bash
PYTHONPATH=.
NODE_ENV=production
```

## 📈 Monitoring and Analytics

### Vercel Analytics
- Function execution times
- Error rates
- Cold start performance
- Request volume

### Custom Monitoring
```bash
# Check function logs
vercel logs

# Monitor function performance
vercel analytics
```

## 🚨 Troubleshooting

### Common Issues:

1. **Function Timeout:**
   - Reduce dataset size
   - Optimize model training
   - Use simpler algorithms

2. **Memory Issues:**
   - Reduce model complexity
   - Use smaller datasets
   - Optimize imports

3. **Cold Start Delays:**
   - Keep dependencies minimal
   - Use efficient imports
   - Consider function warming

4. **Import Errors:**
   - Check `requirements-vercel.txt`
   - Ensure all dependencies are listed
   - Use compatible versions

### Debug Commands:
```bash
# View deployment logs
vercel logs

# Check function status
vercel ls

# Redeploy
vercel --prod
```

## 🔒 Security Considerations

### CORS Configuration
- Currently allows all origins (`*`)
- For production, restrict to your frontend domain:
```python
allow_origins=["https://your-frontend.vercel.app"]
```

### API Rate Limiting
Consider implementing rate limiting:
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
```

## 📊 Performance Optimization

### 1. **Model Optimization**
- Use smaller RandomForest (fewer trees)
- Implement model caching
- Consider simpler algorithms

### 2. **Data Generation**
- Cache synthetic data generation
- Use smaller sample sizes
- Optimize feature engineering

### 3. **Dependencies**
- Remove unused packages
- Use lightweight alternatives
- Minimize import overhead

## 🔄 Updates and Maintenance

### Updating the API:
1. Make changes to `api_vercel.py`
2. Push to GitHub
3. Vercel automatically deploys

### Updating Dependencies:
1. Update `requirements-vercel.txt`
2. Push changes
3. Vercel rebuilds with new dependencies

### Monitoring Performance:
- Check Vercel dashboard for metrics
- Monitor function execution times
- Watch for errors in logs

## 💰 Cost Optimization

### Vercel Pricing:
- **Hobby:** Free tier with limitations
- **Pro:** $20/month for more resources
- **Enterprise:** Custom pricing

### Cost-Saving Tips:
- Optimize function execution time
- Reduce memory usage
- Use efficient algorithms
- Cache results when possible

## 🎯 Production Checklist

- [ ] Deploy to Vercel
- [ ] Test all endpoints
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring
- [ ] Configure CORS for production
- [ ] Test with real frontend
- [ ] Monitor performance
- [ ] Set up alerts
- [ ] Document API endpoints
- [ ] Plan for scaling

## 📞 Support

### Vercel Support:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Vercel Support](https://vercel.com/support)

### API Issues:
- Check function logs in Vercel dashboard
- Test endpoints locally first
- Verify environment variables
- Check dependency versions

Your BoneHealth AI backend will now be running reliably on Vercel's serverless infrastructure! 🚀 