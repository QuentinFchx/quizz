export abstract class AbstractGame {
    static title: string;
    static rules: string;
    public ready = false;

    protected output: (text: string) => void;
    protected over: (user: any) => void;

    abstract start(output: (message: string) => void, over: (user: any) => void): void;

    abstract handleMessage(message: string, user: any): void;

    abstract stop(): void;
}
