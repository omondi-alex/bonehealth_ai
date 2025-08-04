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

  private constructor() {}

  static getInstance(): DataPreloader {
    if (!DataPreloader.instance) {
      DataPreloader.instance = new DataPreloader();
    }
    return DataPreloader.instance;
  }

  async preloadData(): Promise<void> {
    if (this.cachedData) {
      return; // Data already loaded
    }

    if (this.isLoading && this.loadPromise) {
      await this.loadPromise; // Wait for ongoing load
      return;
    }

    this.isLoading = true;
    this.loadPromise = this.fetchData();
    
    try {
      this.cachedData = await this.loadPromise;
    } catch (error) {
      console.error('Failed to preload data science metrics:', error);
    } finally {
      this.isLoading = false;
      this.loadPromise = null;
    }
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
  }

  isDataLoaded(): boolean {
    return this.cachedData !== null;
  }

  isLoadingData(): boolean {
    return this.isLoading;
  }
}

export default DataPreloader;
export type { DataScienceData, Metrics, FeatureImportance, ShapDependence, PartialDependence }; 