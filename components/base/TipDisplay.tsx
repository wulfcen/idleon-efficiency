
import {
    Box,
    Text,
    Tip,
} from 'grommet'

export enum TipDirection {
    Up,
    Down,
    Left,
    Right
}

export interface TipProps {
    heading: string
    body: string
    children: React.ReactNode
    size: string
    direction: TipDirection
    maxWidth?: string
}

export default function TipDisplay({ heading, body, children, size, direction, maxWidth = ''}: TipProps) {
    let dropAlignment = {};
    switch (direction) {
        case TipDirection.Down:
            dropAlignment = { top: 'bottom' };
            break;
        case TipDirection.Left:
            dropAlignment = { right: 'left' };
            break;
        case TipDirection.Right:
            dropAlignment = { left: 'right' };
            break;
        case TipDirection.Up:
            dropAlignment = { bottom: 'top' };
            break;
    }

    return (
        <Tip
            plain
            content={
                <Box pad="small" gap="small" background="white" width={{max: maxWidth}}>
                    <Text size={size == "small" ? 'small' : ''} weight="bold">{heading}</Text>
                    <hr style={{ width: "100%"}} />
                    <Text>{body}</Text>
                </Box>
            }
            dropProps={{ align: dropAlignment }}
        >  
            {children}
        </Tip>
    )
}
