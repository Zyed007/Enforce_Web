export interface ComponentEvent {
    source: string;      // 'info-button', 'action-button', etc.
    data: any;           // or use a specific type instead of 'any'
      // optional property
  }