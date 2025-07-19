# BoneHealth AI Backend Deployment Guide

This guide provides multiple options to ensure your FastAPI backend is always running for predictions.

## 🚀 Quick Start

### Option 1: Simple Script (Development/Testing)
```bash
cd bonehealth_ai/backend
./start_server.sh
```

### Option 2: Automated Setup (Recommended)
```bash
cd bonehealth_ai/backend/scripts
./setup_deployment.sh
```

## 📋 Deployment Options

### 1. Systemd Service (Linux Production - Recommended)

**Advantages:**
- Automatic startup on boot
- Automatic restart on crashes
- System-level logging
- Built into most Linux distributions

**Setup:**
```bash
# Run the automated setup
cd bonehealth_ai/backend/scripts
./setup_deployment.sh
# Choose option 1

# Or manually:
sudo cp systemd/bonehealth-ai.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable bonehealth-ai.service
sudo systemctl start bonehealth-ai.service
```

**Management:**
```bash
sudo systemctl start bonehealth-ai    # Start service
sudo systemctl stop bonehealth-ai     # Stop service
sudo systemctl restart bonehealth-ai  # Restart service
sudo systemctl status bonehealth-ai   # Check status
sudo journalctl -u bonehealth-ai -f   # View logs
```

### 2. Supervisor Process Manager

**Advantages:**
- Cross-platform
- Detailed logging
- Process monitoring
- Easy configuration

**Setup:**
```bash
# Run the automated setup
cd bonehealth_ai/backend/scripts
./setup_deployment.sh
# Choose option 2

# Or manually:
sudo cp supervisor/bonehealth-ai.conf /etc/supervisor/conf.d/
sudo supervisorctl reread
sudo supervisorctl update
```

**Management:**
```bash
sudo supervisorctl start bonehealth-ai    # Start process
sudo supervisorctl stop bonehealth-ai     # Stop process
sudo supervisorctl restart bonehealth-ai  # Restart process
sudo supervisorctl status bonehealth-ai   # Check status
sudo tail -f /var/log/bonehealth-ai/backend.log  # View logs
```

### 3. Docker Containerization

**Advantages:**
- Isolated environment
- Easy scaling
- Consistent deployment
- Built-in health checks

**Setup:**
```bash
# Run the automated setup
cd bonehealth_ai/backend/scripts
./setup_deployment.sh
# Choose option 3

# Or manually:
cd bonehealth_ai/backend/docker
docker-compose up -d
```

**Management:**
```bash
cd bonehealth_ai/backend/docker
docker-compose up -d          # Start containers
docker-compose down           # Stop containers
docker-compose logs -f        # View logs
docker-compose restart        # Restart containers
```

### 4. Custom Monitoring Script

**Advantages:**
- Full control
- Custom logic
- Lightweight

**Usage:**
```bash
# Run in background
cd bonehealth_ai/backend/scripts
nohup ./monitor.sh > /dev/null 2>&1 &

# View monitoring logs
tail -f /var/log/bonehealth-ai/monitor.log
```

## 🔧 Configuration

### Environment Variables

You can customize the backend behavior with these environment variables:

```bash
export HOST="0.0.0.0"        # Bind address (default: 0.0.0.0)
export PORT="8000"           # Port number (default: 8000)
export PYTHONPATH="/path/to/backend"  # Python path
```

### Logging

Logs are stored in `/var/log/bonehealth-ai/`:
- `backend.log` - Application logs
- `monitor.log` - Monitoring script logs

### Health Checks

The backend includes health check endpoints:
- `http://localhost:8000/docs` - API documentation (health check)
- `http://localhost:8000/health` - Simple health endpoint (if configured)

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   sudo lsof -i :8000
   sudo kill -9 <PID>
   ```

2. **Permission denied:**
   ```bash
   sudo chown -R $USER:$USER /var/log/bonehealth-ai
   sudo chmod +x bonehealth_ai/backend/start_server.sh
   ```

3. **Virtual environment not found:**
   ```bash
   # Create virtual environment
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Dependencies missing:**
   ```bash
   pip install fastapi uvicorn pandas scikit-learn shap
   ```

### Debug Mode

For debugging, run the backend directly:
```bash
cd bonehealth_ai/backend
python -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload --log-level debug
```

## 📊 Monitoring and Alerts

### Basic Monitoring

The monitoring script checks the backend every 60 seconds and restarts it if needed.

### Advanced Monitoring

For production environments, consider:
- **Prometheus + Grafana** for metrics
- **Sentry** for error tracking
- **Uptime Robot** for external monitoring
- **Email/SMS alerts** for downtime notifications

### Log Rotation

Configure log rotation to prevent disk space issues:
```bash
sudo nano /etc/logrotate.d/bonehealth-ai
```

Add:
```
/var/log/bonehealth-ai/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
```

## 🔒 Security Considerations

1. **Firewall Configuration:**
   ```bash
   sudo ufw allow 8000/tcp
   ```

2. **HTTPS Setup:**
   - Use nginx with SSL certificates
   - Configure Let's Encrypt for free certificates

3. **Access Control:**
   - Restrict access to specific IPs
   - Implement API authentication
   - Use environment variables for secrets

## 🚀 Production Checklist

- [ ] Choose deployment method (systemd recommended)
- [ ] Set up monitoring and alerts
- [ ] Configure logging and log rotation
- [ ] Set up firewall rules
- [ ] Configure SSL/HTTPS
- [ ] Set up backup strategy
- [ ] Test restart procedures
- [ ] Document deployment process
- [ ] Set up monitoring dashboards
- [ ] Configure error tracking

## 📞 Support

If you encounter issues:
1. Check the logs: `/var/log/bonehealth-ai/`
2. Verify the service status
3. Test the API directly: `curl http://localhost:8000/docs`
4. Check system resources: `htop`, `df -h`

## 🔄 Updates and Maintenance

### Updating the Backend

1. Stop the service:
   ```bash
   sudo systemctl stop bonehealth-ai
   ```

2. Update the code and dependencies:
   ```bash
   git pull
   pip install -r requirements.txt
   ```

3. Restart the service:
   ```bash
   sudo systemctl start bonehealth-ai
   ```

### Regular Maintenance

- Monitor disk space usage
- Review logs for errors
- Update system packages
- Backup configuration files
- Test disaster recovery procedures 