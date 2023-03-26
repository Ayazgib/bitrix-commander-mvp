import { useEffect, useRef } from 'react';

const useKeydown = (keys: any, callback: (event: Event) => void) => {
    console.log(12313123);
    let pressedKeys: string [] = [];
    const callbackRef = useRef(callback);


    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            pressedKeys = [...pressedKeys, e.code]

            // if ((event as KeyboardEvent).key === key) {
            //     callbackRef.current(event);
            // }

            console.log(keys, pressedKeys);
            for (let listHotKeys of keys) {
                for (let hotKey of listHotKeys) {
                    if (!pressedKeys.includes(hotKey)) break;

                    console.log(1212);
                    callbackRef.current(e);
                }
            }
        };

        const upHandler = (e: KeyboardEvent): void => {
            pressedKeys = [...pressedKeys.filter((item: any) => item.code !== e.code)]
        };

        document.addEventListener('keydown', handler);
        document.addEventListener("keyup", upHandler);

        return () => document.removeEventListener('keydown', handler);
    }, [keys]);
}

export default useKeydown;



/*
* function useKeyPress(allWatchedKeys: any []): boolean {
    console.log(allWatchedKeys);
    const [hotkeysPressed, setHotKeysPressed] = useState<any>(null);
    let pressedKeys: string [] = [];

    // @ts-ignore
    function downHandler({code}): void {
        pressedKeys = [...pressedKeys, code]

        for (let targetKeys of allWatchedKeys) {
            for (let listHotKeys of targetKeys) {
                for (let hotKey of listHotKeys) {
                    if (!pressedKeys.includes(hotKey)) return;

                    setHotKeysPressed(targetKeys);
                }
            }
        }

    };

    // @ts-ignore
    const upHandler = ({code}): void => {
        const findCodeIndex = pressedKeys.findIndex((item: any) => item.code === code);
        pressedKeys.splice(findCodeIndex, 1);

        setHotKeysPressed(null);
    };

    useEffect(() => {
        document.addEventListener("keydown", downHandler);
        document.addEventListener("keyup", upHandler);

        return () => {
            document.removeEventListener("keydown", downHandler);
            document.removeEventListener("keyup", upHandler);
        };
    }, []);

    return hotkeysPressed;
}
* */