/**
 * API Type Definitions
 * Types for API request and response payloads
 */

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

export interface EncryptAPIRequest {
  value: number | boolean | string | bigint;
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
  contractAddress: string;
}

export interface EncryptAPIResponse {
  success: boolean;
  encrypted: number[];
  type: string;
  length: number;
}

export interface DecryptAPIRequest {
  handle: string;
  contractAddress: string;
  isPublic?: boolean;
}

export interface DecryptAPIResponse {
  success: boolean;
  value: any;
  type: string;
}

export interface ComputeAPIRequest {
  operation: string;
  operands: string[];
}

export interface ComputeAPIResponse {
  success: boolean;
  message: string;
  operation: string;
  operandCount: number;
  info: string;
}
