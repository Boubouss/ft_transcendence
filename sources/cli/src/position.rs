use crate::size::Size;

#[derive(PartialEq, Eq)]
pub enum VerticalAlign {
    Top,
    // Center,
    Bottom,
}

#[derive(PartialEq, Eq)]
pub enum HorizontalAlign {
    // Left,
    Center,
    // Right,
}

pub struct Alignments {
    pub vertical: VerticalAlign,
    pub horizontal: HorizontalAlign,
}

pub struct Position {
    pub x: u16,
    pub y: u16,
}

impl Position {
    pub fn clone(&self) -> Self {
        Self {
            x: self.x,
            y: self.y,
        }
    }

    pub fn align(&mut self, align: Alignments, terminal_size: &Size) {
        self.x = match align.horizontal {
            // HorizontalAlign::Left => 1,
            HorizontalAlign::Center => terminal_size.width / 2,
            // HorizontalAlign::Right => terminal_size.width,
        };

        self.y = match align.vertical {
            VerticalAlign::Top => 1,
            // VerticalAlign::Center => terminal_size.height / 2,
            VerticalAlign::Bottom => terminal_size.height,
        };
    }

    pub fn move_top(&mut self, distance: u16) -> &Self {
        self.y -= distance;
        self
    }

    pub fn move_bottom(&mut self, distance: u16) -> &Self {
        self.y += distance;
        self
    }

    // pub fn move_left(&mut self, distance: u16) -> &Self {
    //     self.x -= distance;
    //     self
    // }

    // pub fn move_right(&mut self, distance: u16) -> &Self {
    //     self.x += distance;
    //     self
    // }
}
