const context: Record<string, any> = {}

export function useContext() {

    function getContext(key: string) {
        return context[key] ?? null;
    }

    function setContext(key: string, value?: any) {
        context[key] = value;
    }

    return [ getContext, setContext ];

}