import { Injectable } from "@angular/core";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: "root",
})
export class PlatformDetectionService {
  private platform: string;
  private browser: string;
  private connectionType: string;

  constructor() {
    this.platform = this.getPlatform();
    this.browser = this.getBrowser();
    this.connectionType = this.getConnectionType();

    // Listen for connection changes
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      connection.addEventListener('change', () => {
        this.handleConnectionChange();
      });
    }

    window.addEventListener('offline', () => this.handleOfflineStatus());
    window.addEventListener('online', () => this.handleOnlineStatus());
  }

  private getPlatform(): string {
    const userAgent = window.navigator.userAgent;
    if (/android/i.test(userAgent)) {
      return "Android";
    }
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return "iOS";
    }
    if (/Win/i.test(userAgent)) {
      return "Windows";
    }
    if (/Mac/i.test(userAgent)) {
      return "MacOS";
    }
    if (/Linux/i.test(userAgent)) {
      return "Linux";
    }
    return "Unknown";
  }

  private getBrowser(): string {
    const userAgent = window.navigator.userAgent;
    if (/edg/i.test(userAgent)) {
      return "Edge";
    }
    if (/chrome|crios|crmo/i.test(userAgent)) {
      return "Chrome";
    }
    if (/msie|trident/i.test(userAgent)) {
      return "Internet Explorer";
    }
    if (/firefox|fxios/i.test(userAgent)) {
      return "Firefox";
    }
    if (/opr|opera/i.test(userAgent)) {
      return "Opera";
    }
    if (/safari/i.test(userAgent)) {
      return "Safari";
    }
    return "Unknown";
  }

  public getConnectionType(): string {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection && connection.effectiveType) {
      return connection.effectiveType;  
    }
    return "Unknown";
  }

  public monitorConnection() {
    this.handleConnectionChange();

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', () => {
        this.handleConnectionChange();
      });
    }
  }

  private handleConnectionChange() {
    const effectiveType = this.getConnectionType();
    this.checkConnectionSpeed(effectiveType);
  }

  private checkConnectionSpeed(effectiveType: string) {
    const slowConnectionTypes = ['slow-2g', '2g', '3g'];
    if (slowConnectionTypes.includes(effectiveType)) {
      Swal.fire({
        title: 'Low Internet Speed Detected',
        text: `Your current network connection speed may cause delays and slow performance. Please switch to a faster connection for an improved experience.`,
        confirmButtonText: 'OK',
        allowOutsideClick: false,
        type: "warning",
      });
    }
  }

  public handleOfflineStatus() {
    Swal.fire({
      title: 'You Are Offline',
      text: "You've lost your internet connection. Please verify your network settings to restore connectivity.",
      confirmButtonText: 'Retry',
      allowOutsideClick: false,
      type: "warning",
      showCancelButton: false,
    }).then((result) => {
      if (result.value) {
        this.retryConnection();
      }
    });
  }

  private async retryConnection() {
    let status = await this.checkInternetConnection();
    if (status) {
      const result = await Swal.fire({
        title: 'Connection Restored',
        text: 'You are back online!',
        confirmButtonText: 'OK',
        type: 'success',
      });
  
      if (result.value) {
        window.location.reload();
      }
    } else {
      this.handleOfflineStatus(); 
    }
  }
  public async checkInternetConnection(): Promise<boolean> {
    try {
      const response = await fetch("https://www.google.com", {
        method: "HEAD",
        mode: "no-cors",
      });
      return true; 
    } catch (e) {
      return false; 
    }
  }

  // private handleOnlineStatus() {
  //   Swal.fire({
  //     title: 'You Are Back Online',
  //     confirmButtonText: 'OK',
  //     allowOutsideClick: false,
  //     type: "success",
  //   });
  // }
  private handleOnlineStatus() {
    Swal.fire({
        title: 'You Are Back Online',
        type: 'success', 
        timer: 2000, 
    });
}

  public isOnline(): boolean {
    return navigator.onLine;
  }

  toString(): string {
    return `${this.platform}/${this.browser}/${this.connectionType}`;
  }
}
