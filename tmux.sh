#!/usr/bin/env bash

SESSION="ft_transcendence"
ROOT="$HOME/Code/ft_transcendence/"

if tmux has-session -t "$SESSION"; then
	tmux attach -t "$SESSION:1" -c "$ROOT"
	exit
fi

(
	cd "$ROOT"

	tmux new-session -d -s "$SESSION"
	tmux send-keys -t "$SESSION:1" 'nvim -c "Explore"' C-m

	tmux new-window -t "$SESSION:2"
	tmux split-window -v -t "$SESSION:2"
	tmux split-window -h -t "$SESSION:2.1"
	tmux split-window -h -t "$SESSION:2.1"
	tmux split-window -h -t "$SESSION:2.1"
	tmux send-keys -t "$SESSION:2.1" "cd sources/front/ && npx vite" C-m
	tmux send-keys -t "$SESSION:2.2" "cd sources/user/ && npm start" C-m
	tmux send-keys -t "$SESSION:2.3" "cd sources/logic && npm start" C-m
	tmux send-keys -t "$SESSION:2.4" "cd sources/game && npm start" C-m
	tmux select-pane -t 5
	tmux select-layout -t "$SESSION:2" tiled
)

tmux attach -t "$SESSION:1" -c "$ROOT"
