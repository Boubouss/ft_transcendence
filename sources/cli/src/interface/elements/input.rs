use crate::{position::Position, size::Size, ACTIVE_COLOR, BACKGROUND_COLOR, COLOR};
use is_printable::IsPrintable;
use std::{cmp::Ordering, fmt::Write};
use termion::color::{Bg, Fg, Rgb};

use super::Element;

pub struct Input {
    position: Position,
    size: Size,
    name: String,
    value: String,
    hidden: bool,
    color: Fg<Rgb>,
    background_color: Bg<Rgb>,
}

impl Input {
    pub fn get_name(&self) -> &String {
        &self.name
    }

    pub fn get_value(&self) -> &String {
        &self.value
    }

    pub fn set_hidden(&mut self, hidden: bool) {
        self.hidden = hidden;
    }

    pub fn get_content(&self, is_active: bool) -> String {
        let mut content = String::new();
        let end = self.size.width * self.size.height;

        write!(
            content,
            "{}{}",
            self.color,
            termion::cursor::Goto(self.position.x, self.position.y),
        )
        .unwrap();

        if is_active {
            write!(content, "{}", Bg(ACTIVE_COLOR)).unwrap();
        } else {
            write!(content, "{}", self.background_color).unwrap();
        }

        for i in 0..end as usize {
            match self.value.chars().count().cmp(&i) {
                Ordering::Greater => {
                    if self.hidden {
                        content.push('*');
                    } else {
                        let difference = i32::max(0, self.value.len() as i32 - end as i32);

                        content.push(self.value.as_bytes()[i + difference as usize] as char);
                    }
                }
                Ordering::Equal => {
                    if is_active {
                        content.push('_');
                    } else {
                        content.push(' ');
                    }
                }
                Ordering::Less => {
                    content.push(' ');
                }
            };
        }

        content
    }

    pub fn handle_input(&mut self, input: char) {
        if !self.value.is_empty() && input as u8 == 127 {
            self.value.pop();
            return;
        }

        if !input.is_printable() {
            return;
        }

        self.value.push(input);
    }
}

impl Element for Input {
    fn new(mut position: Position, name: String) -> Self {
        let size = Size {
            width: 36,
            height: 1,
        };

        position.x -= if position.x > size.height {
            size.width / 2
        } else {
            0
        };

        position.y -= if position.y > size.height {
            size.height / 2
        } else {
            0
        };

        Self {
            position,
            size,
            name,
            value: String::new(),
            hidden: false,
            color: Fg(BACKGROUND_COLOR),
            background_color: Bg(COLOR),
        }
    }
}
