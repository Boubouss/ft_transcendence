const context: Record<string, any> = {}

export function useContext(): [(key:string) => unknown, (key:string, value:any) => void] {

    function getContext(key: string): unknown {
        return context[key] ?? null;
    }

    function setContext(key: string, value?: any) {
        context[key] = value;
    }

    return [ getContext, setContext ];

}

export function printContext() {
    console.log(context)
}