export interface HealthResponse {
  ok: boolean;
}

export interface StatusResponse {
  ok: boolean;
  service: string;
  version: string;
  node: string;
  uptimeSeconds: number;
  message: string;
  timestamp: string;
}
