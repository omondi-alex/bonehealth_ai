interface Metrics {
  accuracy: { mean: number; std: number };
  f1: { mean: number; std: number };
  recall: { mean: number; std: number };
  precision?: { mean: number; std: number };
  roc_auc?: { mean: number; std: number };
}

interface FeatureImportance {
  feature: string;
  importance: number;
}

interface ShapDependence {
  age: number;
  shap: number;
}

interface PartialDependence {
  calcium: number;
  pred: number;
}

interface DataScienceData {
  metrics: Metrics;
  prob_dist: { hist: number[]; bin_edges: number[] };
  feature_importance: FeatureImportance[];
  shap_dependence: ShapDependence[];
  partial_dependence: PartialDependence[];
  y_proba: number[];
  first_patient_risk: number | null;
  first_patient_shap: number[];
  first_patient_features: string[];
  shap_base_value: number | null;
  sample_shap_values: number[];
  sample_features: string[];
}

class DataPreloader {
  private static instance: DataPreloader;
  private cachedData: DataScienceData | null = null;
  private isLoading = false;
  private loadPromise: Promise<DataScienceData> | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

  private constructor() {
    // Try to restore from sessionStorage on initialization
    this.restoreFromSessionStorage();
  }

  static getInstance(): DataPreloader {
    if (!DataPreloader.instance) {
      DataPreloader.instance = new DataPreloader();
    }
    return DataPreloader.instance;
  }

  async preloadData(): Promise<void> {
    // If we have valid cached data, return immediately
    if (this.isCacheValid()) {
      return;
    }

    // If we're already loading, wait for the existing promise
    if (this.isLoading && this.loadPromise) {
      await this.loadPromise;
      return;
    }

    this.isLoading = true;
    this.loadPromise = this.fetchData();
    
    try {
      this.cachedData = await this.loadPromise;
      this.lastFetchTime = Date.now();
      this.saveToSessionStorage();
    } catch (error) {
      console.error('Failed to preload data science metrics:', error);
      // If we have stale cached data, keep it
      if (!this.cachedData) {
        throw error;
      }
    } finally {
      this.isLoading = false;
      this.loadPromise = null;
    }
  }

  private isCacheValid(): boolean {
    if (!this.cachedData) return false;
    
    // Check if cache is still within the valid duration
    const now = Date.now();
    return (now - this.lastFetchTime) < this.CACHE_DURATION;
  }

  private async fetchData(): Promise<DataScienceData> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data-science-metrics`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  }

  getCachedData(): DataScienceData | null {
    return this.cachedData;
  }

  clearCache(): void {
    this.cachedData = null;
    this.lastFetchTime = 0;
    this.removeFromSessionStorage();
  }

  isDataLoaded(): boolean {
    return this.cachedData !== null && this.isCacheValid();
  }

  isLoadingData(): boolean {
    return this.isLoading;
  }

  // Session storage methods for persistence across page reloads
  private saveToSessionStorage(): void {
    if (this.cachedData) {
      try {
        sessionStorage.setItem('dataScienceCache', JSON.stringify({
          data: this.cachedData,
          timestamp: this.lastFetchTime
        }));
      } catch (error) {
        console.warn('Failed to save to sessionStorage:', error);
      }
    }
  }

  private restoreFromSessionStorage(): void {
    try {
      const cached = sessionStorage.getItem('dataScienceCache');
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        
        // Only restore if cache is still valid
        if ((now - parsed.timestamp) < this.CACHE_DURATION) {
          this.cachedData = parsed.data;
          this.lastFetchTime = parsed.timestamp;
        } else {
          // Clear expired cache
          this.removeFromSessionStorage();
        }
      }
    } catch (error) {
      console.warn('Failed to restore from sessionStorage:', error);
      this.removeFromSessionStorage();
    }
  }

  private removeFromSessionStorage(): void {
    try {
      sessionStorage.removeItem('dataScienceCache');
    } catch (error) {
      console.warn('Failed to remove from sessionStorage:', error);
    }
  }

  // Force refresh method for manual cache invalidation
  async forceRefresh(): Promise<void> {
    this.clearCache();
    await this.preloadData();
  }
}

export default DataPreloader;
export type { DataScienceData, Metrics, FeatureImportance, ShapDependence, PartialDependence }; 