import Event from './event'

export interface Match {
    kickOffTime: Date;
    halfTime: Date;
    kickOffTime2ndHalf: Date;
    fullTime: Date;
    halfLength: number;
    opponent: string;
    location: 'HOME' | 'AWAY';
    wcfcScore: number;
    opponentScore: number;
    wcfcScorers: Event[];
    wcfcAssists: Event[];
    opponentScorers: Event[];
}