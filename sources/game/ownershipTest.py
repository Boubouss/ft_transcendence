import asyncio
import websockets
import ssl

async def client_websocket(client_id, uri):
    ssl_context = ssl.SSLContext()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    headers = {
        # "sec-websocket-protocol": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvbGlkQHRlc3QuY29tIiwiaWF0IjoxNzU0NTY5NjI1fQ.TQFVs4cAQrGvOkqYwD5jWcmos5ZP71DdORL7Xvkn2Tk"
    }

    try:
        async with websockets.connect(uri + str(client_id), ssl=ssl_context, extra_headers=headers) as websocket:
            await asyncio.sleep(0.5)
            if client_id == 2:
                await websocket.send(
                    '{\n\t"event": "CREATE",\n\t"data": {\n\t\t"player_limit": 3,\n\t\t"is_tournament": false\n\t}\n}'
                )
                await asyncio.sleep(5)
                await websocket.send(
                    '{\n\t"event": "ACTION",\n\t"data": {\n\t\t"target_id": 2,\n\t\t"action": "LEAVE"\n\t}\n}'
                )
                # await close()
            else:
                await asyncio.sleep(1)
                await websocket.send(
                    '{\n\t"event": "ACTION",\n\t"data": {\n\t\t"target_id": 2,\n\t\t"action": "JOIN"\n\t}\n}'
                )
            await asyncio.sleep(440)
    except Exception as e:
        print(e)

async def main():
    uri = "wss://localhost:3001/lobby/"
    start = 2
    end = 3
    tasks = [client_websocket(i, uri) for i in range(start, end + 1, 1)]
    await asyncio.gather(*tasks)

asyncio.run(main())
