interface MsOutput {
    minutes: number;
    seconds: number;
    milli: number;
}
export default function msToReadable(ms: number): MsOutput {
    return {
        minutes: Math.floor(ms / (60 * 1000)),
        seconds: Math.floor(ms / 1000) % 60,
        milli: ms % 1000,
    }
}