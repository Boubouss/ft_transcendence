use crate::{
    position::{HorizontalAlign, Position, VerticalAlign},
    size::Size,
    BACKGROUND_COLOR, COLOR,
};

use termion::color::{Bg, Fg, Rgb};

#[derive(PartialEq, Eq)]
pub enum ElementKind {
    Text,
    Button,
    Input,
}

pub enum ElementAction {
    LoadMain,
    LoadLogin,
    Input,
    Exit,
}

pub struct Element {
    kind: ElementKind,
    content: String,
    value: String,
    action: Option<ElementAction>,
    pos: Position,
    size: Size,
    color: Fg<Rgb>,
    background_color: Bg<Rgb>,
}

impl Element {
    pub fn from(kind: ElementKind, content: String) -> Self {
        let pos = Position { x: 0, y: 0 };

        let size = Size::from_str(&content);

        Self {
            kind,
            content,
            value: String::new(),
            action: None,
            pos,
            size,
            color: Fg(COLOR),
            background_color: Bg(BACKGROUND_COLOR),
        }
    }

    pub fn get_content(&self, is_selected: bool) -> String {
        let x = self.pos.x;
        let mut y = self.pos.y;
        let mut steps = 0;
        let result = String::new();

        print!("{}", termion::cursor::Goto(x, y));
        print!("{}", self.color);

        if is_selected {
            print!("{}", Bg(Rgb(0, 255, 0)));
        } else {
            print!("{}", self.background_color);
        }

        for character in self.value.chars() {
            print!("{}", character);
            steps += 1;
        }

        if self.kind == ElementKind::Input && is_selected {
            print!("_");
        }

        for it in self.content.char_indices().skip(steps) {
            print!("{}", it.1);

            if it.1 == '\n' && it.0 < self.content.len() {
                y += 1;

                print!("{}", termion::cursor::Goto(x, y));
            }
        }

        result
    }

    pub fn get_kind(&self) -> &ElementKind {
        &self.kind
    }

    pub fn get_action(&self) -> &Option<ElementAction> {
        &self.action
    }

    pub fn set_action(&mut self, action: ElementAction) {
        self.action = Some(action);
    }

    pub fn set_color(&mut self, color: Rgb) {
        self.color = Fg(color);
    }

    pub fn set_background(&mut self, background_color: Rgb) {
        self.background_color = Bg(background_color);
    }

    pub fn vertical_align(&mut self, alignement: VerticalAlign, window_size: &Size, padding: u16) {
        if alignement == VerticalAlign::Top {
            self.pos.y = padding + 1;
        } else if alignement == VerticalAlign::Center {
            self.pos.y = (window_size.height / 2) - (self.size.height / 2) + padding;
        } else if alignement == VerticalAlign::Bottom {
            self.pos.y = window_size.height - self.size.height - padding;
        }
    }

    pub fn horizontal_align(
        &mut self,
        alignement: HorizontalAlign,
        window_size: &Size,
        padding: u16,
    ) {
        if alignement == HorizontalAlign::Left {
            self.pos.x = padding + 1;
        } else if alignement == HorizontalAlign::Center {
            self.pos.x = (window_size.width / 2) - (self.size.width / 2) + padding;
        } else if alignement == HorizontalAlign::Right {
            self.pos.x = window_size.width - self.size.width - padding;
        }
    }

    pub fn handle_input(&mut self, input: char) {
        if !self.value.is_empty() && input as u8 == 127 {
            self.value.pop();
            return;
        }

        if self.value.len() >= 20 || !input.is_alphanumeric() {
            return;
        }

        self.value.push(input);
    }
}
