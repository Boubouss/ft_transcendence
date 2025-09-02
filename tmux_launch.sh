#!/bin/bash

SESSION_NAME="transcendence"

tmux new-session -d -s $SESSION_NAME -n "main"

tmux new-window -t $SESSION_NAME:1 -n "exec"

tmux split-window -h -t $SESSION_NAME:1
tmux split-window -v -t $SESSION_NAME:1
tmux split-window -v -t $SESSION_NAME:1
tmux split-window -v -t $SESSION_NAME:1

tmux select-layout -t $SESSION_NAME:1 main-vertical

tmux select-pane -t 1
tmux send-keys "cd ./sources/front/ && npm run dev" C-m

tmux select-pane -t 2
tmux send-keys "cd ./sources/user/ && npm run start" C-m

tmux select-pane -t 3
tmux send-keys "cd ./sources/game/ && npm run start" C-m

tmux select-pane -t 4
tmux send-keys "cd ./sources/logic/ && npm run start" C-m

tmux select-pane -t 0

tmux select-window -t "main"
tmux send-keys "nvim" C-m

tmux attach-session -t $SESSION_NAME
