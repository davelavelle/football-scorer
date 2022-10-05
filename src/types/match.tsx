import Event from './event'

export default interface Match {
    id: number;
    matchDate: Date;
    kickOffTime?: Date;
    halfTime?: Date;
    kickOffTime2ndHalf?: Date;
    fullTime?: Date;
    halfLength: number;
    opponent: string;
    location: 'HOME' | 'AWAY';
    wcfcScore: number;
    opponentScore: number;
    wcfcScorers: Event[];
    wcfcAssists: Event[];
    opponentScorers: Event[];
    squad: string[];
}