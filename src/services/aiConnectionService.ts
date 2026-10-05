export interface ConnectionTestResult {
  success: boolean;
  provider: string;
  model?: string;
  status: string;
  latencyMs: number;
  details: string;
  testedAt: string;
}

/**
 * Service layer to perform authenticated ping requests to AI providers.
 * Communicates with the backend server-side AI proxy to verify active keys and model availability.
 */
export async function testProviderConnection(
  provider: 'gemini' | 'groq' | 'openrouter' | 'cerebras'
): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  try {
    const response = await fetch('/api/ai/test-provider', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const result: ConnectionTestResult = {
      success: !!data.success,
      provider: data.provider || provider,
      model: data.model,
      status: data.status || (data.success ? 'Active & Verified' : 'Failed'),
      latencyMs: typeof data.latencyMs === 'number' ? data.latencyMs : Date.now() - startTime,
      details: data.details || '',
      testedAt: new Date().toLocaleTimeString(),
    };

    // Save to localStorage for persistence
    try {
      const existing = localStorage.getItem('sc_provider_status');
      const parsed = existing ? JSON.parse(existing) : {};
      parsed[provider] = result;
      localStorage.setItem('sc_provider_status', JSON.stringify(parsed));
    } catch {
      // Storage unavailable or quota exceeded
    }

    return result;
  } catch (error: any) {
    const failedResult: ConnectionTestResult = {
      success: false,
      provider: provider.toUpperCase(),
      status: 'Connection Error',
      latencyMs: Date.now() - startTime,
      details: error?.message || 'Unable to connect to service endpoint',
      testedAt: new Date().toLocaleTimeString(),
    };

    try {
      const existing = localStorage.getItem('sc_provider_status');
      const parsed = existing ? JSON.parse(existing) : {};
      parsed[provider] = failedResult;
      localStorage.setItem('sc_provider_status', JSON.stringify(parsed));
    } catch {}

    return failedResult;
  }
}

/**
 * Retrieves cached provider connection statuses from local storage.
 */
export function getSavedProviderStatuses(): Record<string, ConnectionTestResult> {
  try {
    const saved = localStorage.getItem('sc_provider_status');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}
