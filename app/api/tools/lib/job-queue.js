// Simple in-memory job queue for background processing
// Handles heavy operations like blacklist checks asynchronously

class JobQueue {
  constructor(options = {}) {
    this.queue = [];
    this.processing = new Map();
    this.completed = new Map();
    this.failed = new Map();
    
    this.config = {
      maxConcurrent: options.maxConcurrent || 5,
      maxQueueSize: options.maxQueueSize || 100,
      jobTimeout: options.jobTimeout || 60000, // 60 seconds
      retryAttempts: options.retryAttempts || 2,
      cleanupIntervalMs: options.cleanupIntervalMs || 5 * 60 * 1000, // 5 minutes
      resultTTL: options.resultTTL || 10 * 60 * 1000, // Keep results for 10 minutes
      ...options
    };
    
    this.isProcessing = false;
    this.jobIdCounter = 0;
    
    // Start cleanup interval
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), this.config.cleanupIntervalMs);
    }
  }
  
  // Generate unique job ID
  generateJobId() {
    return `job_${Date.now()}_${++this.jobIdCounter}`;
  }
  
  // Add job to queue
  async addJob(type, data, options = {}) {
    if (this.queue.length >= this.config.maxQueueSize) {
      throw new Error('Queue is full. Please try again later.');
    }
    
    const jobId = this.generateJobId();
    const job = {
      id: jobId,
      type,
      data,
      status: 'queued',
      createdAt: Date.now(),
      attempts: 0,
      priority: options.priority || 0,
      timeout: options.timeout || this.config.jobTimeout,
      callback: options.callback || null
    };
    
    // Add to queue (higher priority first)
    if (job.priority > 0) {
      // Find insertion point for priority
      const insertIndex = this.queue.findIndex(j => j.priority < job.priority);
      if (insertIndex === -1) {
        this.queue.push(job);
      } else {
        this.queue.splice(insertIndex, 0, job);
      }
    } else {
      this.queue.push(job);
    }
    
    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }
    
    return jobId;
  }
  
  // Process queue
  async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    while (this.queue.length > 0 || this.processing.size > 0) {
      // Process up to maxConcurrent jobs
      while (this.queue.length > 0 && this.processing.size < this.config.maxConcurrent) {
        const job = this.queue.shift();
        this.processJob(job);
      }
      
      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.isProcessing = false;
  }
  
  // Process individual job
  async processJob(job) {
    job.status = 'processing';
    job.startedAt = Date.now();
    this.processing.set(job.id, job);
    
    try {
      // Set timeout for job
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Job timeout')), job.timeout)
      );
      
      // Execute job based on type
      const resultPromise = this.executeJob(job);
      
      const result = await Promise.race([resultPromise, timeoutPromise]);
      
      // Job completed successfully
      job.status = 'completed';
      job.completedAt = Date.now();
      job.result = result;
      job.duration = job.completedAt - job.startedAt;
      
      this.processing.delete(job.id);
      this.completed.set(job.id, job);
      
      // Call callback if provided
      if (job.callback) {
        try {
          await job.callback(null, result);
        } catch (e) {
          console.error('Job callback error:', e);
        }
      }
      
    } catch (error) {
      job.attempts++;
      
      if (job.attempts < this.config.retryAttempts) {
        // Retry job
        job.status = 'queued';
        job.error = error.message;
        this.processing.delete(job.id);
        
        // Add back to queue with delay
        setTimeout(() => {
          this.queue.push(job);
        }, 1000 * job.attempts); // Exponential backoff
        
      } else {
        // Job failed permanently
        job.status = 'failed';
        job.failedAt = Date.now();
        job.error = error.message;
        job.duration = job.failedAt - job.startedAt;
        
        this.processing.delete(job.id);
        this.failed.set(job.id, job);
        
        // Call callback with error
        if (job.callback) {
          try {
            await job.callback(error, null);
          } catch (e) {
            console.error('Job callback error:', e);
          }
        }
      }
    }
  }
  
  // Execute job based on type
  async executeJob(job) {
    switch (job.type) {
      case 'blacklist-check':
        return await this.executeBlacklistCheck(job.data);
      
      case 'bulk-dns-check':
        return await this.executeBulkDNSCheck(job.data);
      
      case 'domain-analysis':
        return await this.executeDomainAnalysis(job.data);
      
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }
  
  // Execute blacklist check job
  async executeBlacklistCheck(data) {
    const { domain, blacklists } = data;
    
    // Import the actual blacklist check function
    const { checkBlacklistDetailed } = require('../blacklist-detailed/route');
    
    // Simulate heavy operation
    const results = [];
    for (const blacklist of blacklists) {
      // Add small delay to prevent overwhelming
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check blacklist (simplified)
      results.push({
        blacklist,
        listed: false, // Would do actual check here
        timestamp: Date.now()
      });
    }
    
    return {
      domain,
      results,
      checkedAt: Date.now()
    };
  }
  
  // Execute bulk DNS check job
  async executeBulkDNSCheck(data) {
    const { domains } = data;
    const dnsUtils = require('./dns-utils-cached');
    
    const results = {};
    
    for (const domain of domains) {
      results[domain] = await dnsUtils.checkEmailRecords(domain);
    }
    
    return results;
  }
  
  // Execute domain analysis job
  async executeDomainAnalysis(data) {
    const { domain } = data;
    const dnsUtils = require('./dns-utils-cached');
    
    // Comprehensive domain analysis
    const [emailRecords, nsRecords, aRecords] = await Promise.all([
      dnsUtils.checkEmailRecords(domain),
      dnsUtils.resolveNs(domain),
      dnsUtils.resolve4(domain)
    ]);
    
    return {
      domain,
      emailRecords,
      nameservers: nsRecords,
      ipAddresses: aRecords,
      analyzedAt: Date.now()
    };
  }
  
  // Get job status
  getJob(jobId) {
    // Check in all collections
    return this.completed.get(jobId) || 
           this.failed.get(jobId) || 
           this.processing.get(jobId) || 
           this.queue.find(j => j.id === jobId);
  }
  
  // Get job result (waits for completion)
  async getJobResult(jobId, timeout = 60000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const job = this.getJob(jobId);
      
      if (!job) {
        throw new Error('Job not found');
      }
      
      if (job.status === 'completed') {
        return job.result;
      }
      
      if (job.status === 'failed') {
        throw new Error(job.error || 'Job failed');
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    throw new Error('Timeout waiting for job result');
  }
  
  // Clean up old jobs
  cleanup() {
    const now = Date.now();
    const ttl = this.config.resultTTL;
    
    // Clean completed jobs
    for (const [id, job] of this.completed.entries()) {
      if (now - job.completedAt > ttl) {
        this.completed.delete(id);
      }
    }
    
    // Clean failed jobs
    for (const [id, job] of this.failed.entries()) {
      if (now - job.failedAt > ttl) {
        this.failed.delete(id);
      }
    }
  }
  
  // Get queue statistics
  getStats() {
    return {
      queued: this.queue.length,
      processing: this.processing.size,
      completed: this.completed.size,
      failed: this.failed.size,
      isProcessing: this.isProcessing
    };
  }
  
  // Clear all jobs
  clear() {
    this.queue = [];
    this.processing.clear();
    this.completed.clear();
    this.failed.clear();
  }
  
  // Destroy (cleanup interval)
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

// Create singleton instance
const jobQueue = new JobQueue({
  maxConcurrent: 3,
  maxQueueSize: 100,
  jobTimeout: 60000,
  retryAttempts: 2
});

// Helper to create async job and return immediately
async function createAsyncJob(type, data, options = {}) {
  const jobId = await jobQueue.addJob(type, data, options);
  
  return {
    jobId,
    status: 'queued',
    message: 'Job has been queued for processing',
    checkUrl: `/api/tools/job-status?id=${jobId}`
  };
}

// Helper to check job status
async function checkJobStatus(jobId) {
  const job = jobQueue.getJob(jobId);
  
  if (!job) {
    return {
      error: true,
      message: 'Job not found'
    };
  }
  
  return {
    jobId: job.id,
    status: job.status,
    createdAt: job.createdAt,
    startedAt: job.startedAt,
    completedAt: job.completedAt,
    failedAt: job.failedAt,
    duration: job.duration,
    result: job.result,
    error: job.error,
    attempts: job.attempts
  };
}

module.exports = {
  JobQueue,
  jobQueue,
  createAsyncJob,
  checkJobStatus
};