pub struct Size {
    pub width: u16,
    pub height: u16,
}

impl Size {
    pub fn from_str(content: &str) -> Size {
        let mut width = 0;
        let mut height = 0;

        for character in content.chars() {
            if character == '\n' {
                height += 1;
            } else if height < 1 {
                width += 1;
            }
        }

        Self { width, height }
    }
}
