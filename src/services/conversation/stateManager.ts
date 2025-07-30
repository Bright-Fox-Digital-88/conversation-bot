import fs from 'fs';
import path from 'path';

interface ConversationState {
  currentIndex: number;
  lastMessageTime: string;
  isActive: boolean;
  messageCount: number;
}

const STATE_FILE_PATH = path.join(process.cwd(), 'conversation-state.json');

// Default state
const DEFAULT_STATE: ConversationState = {
  currentIndex: 0,
  lastMessageTime: new Date().toISOString(),
  isActive: false,
  messageCount: 0
};

class StateManager {
  private state: ConversationState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): ConversationState {
    try {
      if (fs.existsSync(STATE_FILE_PATH)) {
        const data = fs.readFileSync(STATE_FILE_PATH, 'utf8');
        return { ...DEFAULT_STATE, ...JSON.parse(data) };
      }
    } catch (error) {
      console.error('[StateManager] Error loading state:', error);
    }
    return { ...DEFAULT_STATE };
  }

  private saveState(): void {
    try {
      fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(this.state, null, 2));
    } catch (error) {
      console.error('[StateManager] Error saving state:', error);
    }
  }

  getCurrentIndex(): number {
    return this.state.currentIndex;
  }

  setCurrentIndex(index: number): void {
    this.state.currentIndex = index;
    this.state.lastMessageTime = new Date().toISOString();
    this.saveState();
  }

  incrementIndex(): void {
    this.state.currentIndex += 1;
    this.state.messageCount += 1;
    this.state.lastMessageTime = new Date().toISOString();
    this.saveState();
  }

  resetState(): void {
    this.state = { ...DEFAULT_STATE };
    this.saveState();
  }

  getState(): ConversationState {
    return { ...this.state };
  }

  setActive(active: boolean): void {
    this.state.isActive = active;
    this.saveState();
  }

  isActive(): boolean {
    return this.state.isActive;
  }

  getMessageCount(): number {
    return this.state.messageCount;
  }

  getLastMessageTime(): string {
    return this.state.lastMessageTime;
  }
}

// Export singleton instance
export const stateManager = new StateManager(); 