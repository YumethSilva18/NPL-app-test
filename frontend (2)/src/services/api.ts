import type {
  PredictionRequest,
  PredictionResponse,
  HealthResponse } from
'../types/prediction';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Transform camelCase to snake_case for backend
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
      );
      acc[snakeKey] = toSnakeCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

// Transform snake_case to camelCase from backend
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase()
      );
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
}

export const api = {
  async checkHealth(): Promise<HealthResponse> {
    const startTime = Date.now();
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    const data = await response.json();
    return {
      ...toCamelCase(data),
      responseTime
    };
  },

  async predict(data: PredictionRequest): Promise<PredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(toSnakeCase(data))
    });

    if (!response.ok) {
      throw new Error('Prediction request failed');
    }

    const result = await response.json();
    return toCamelCase(result);
  },

  async getHistory(): Promise<PredictionHistory[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/history`);
      
      if (!response.ok) {
        throw new Error('History request failed');
      }

      const data = await response.json();
      return toCamelCase(data);
    } catch (error) {
      // If API doesn't exist, return empty array to fall back to demo data
      throw error;
    }
  }
};