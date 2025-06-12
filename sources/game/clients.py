import asyncio
import websockets
import ssl

async def client_websocket(client_id, uri):
    ssl_context = ssl.SSLContext()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNvbGlkQHRlc3QuY29tIiwiaWF0IjoxNzQ5NjUzMzEwfQ.9LzlgXtH-JDxhD25c2WxLFU-eBpA5HQ-yYQ9y2cTweI"
    }

    try:
        async with websockets.connect(uri + str(client_id), ssl=ssl_context, extra_headers=headers) as websocket:
            await asyncio.sleep(0.5)

            if client_id == 1:
                await websocket.send(
                    '{\n\t\"event\": \"CREATE\",\n\t\"data\": {\n\t\t\"player_limit\": 8,\n\t\t\"is_tournament\": true\n\t}\n}'
                )
            else:
                await asyncio.sleep(1)
                await websocket.send(
                    '{\n\t\"event\": \"ACTION\",\n\t\"data\": {\n\t\t\"target_id\": 1,\n\t\t\"action\": \"JOIN\"\n\t}\n}'
                )

            await asyncio.sleep(440)
    except Exception as e:
        printf(e);

async def main():
    uri = "wss://localhost:3001/lobby/"
    num_clients = 9
    tasks = [client_websocket(i, uri) for i in range(1, num_clients)]
    await asyncio.gather(*tasks)

asyncio.run(main())
