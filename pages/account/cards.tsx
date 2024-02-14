import {
    Box,
    Text,
    Heading,
    Grid,
    Stack
} from 'grommet'
import { useEffect, useContext, useState } from 'react';
import { AppContext } from '../../data/appContext';
import { NextSeo } from 'next-seo';
import ShadowBox from '../../components/base/ShadowBox';
import IconImage from '../../components/base/IconImage';
import { Card } from '../../data/domain/cards';
import { CardSet } from '../../data/domain/cardSets';
import TipDisplay, { TipDirection } from '../../components/base/TipDisplay';
import { CircleInformation } from 'grommet-icons';
import { initCardSetRepo } from '../../data/domain/data/CardSetRepo';

const CardBox = ({ card }: { card: Card}) => {
    return (
        <ShadowBox background='dark-1' style={{ opacity: card.count > 0 ? 1 : 0.5 }} gap='small' pad='medium' align='left'>
            <Box direction='row' gap='small' align='left'>
                <Box direction='column' gap='small' align='center'>
                    <Stack>
                        <Box>
                            <IconImage data={card.getImageData()} />
                        </Box>
                        <Box>
                            <IconImage data={card.getBorderImageData()} />
                        </Box>
                    </Stack>
                </Box>
                <Box direction='column' gap='none' align='left'>
                    <Text size='medium'>{card.displayName}</Text>
                    <Text size='small'>{card.getBonusText()+((card.passive && !card.data.effect.endsWith('(Passive)')) ? ' (Passive)' : '')}</Text>
                </Box>
            </Box>            
        </ShadowBox>
    )
}

const CardSetBox = ({ cardSet }: {cardSet: CardSet}) => {
    return (
        <ShadowBox background='dark-1' style={{ opacity: cardSet.cards?.reduce((sum, card) => { return sum + card.count; }, 0) > 0 ? 1 : 0.5 }} gap='small' pad='medium'>
            <Box direction='column' gap='small' align='center'>
                <Box direction='row' gap='medium' align='center'>
                    <Stack>
                        <Box>
                            <IconImage data={cardSet.getImageData()} />
                        </Box>
                        <Box>
                            <IconImage data={cardSet.getBorderImageData()} />
                        </Box>
                    </Stack>
                    <Box direction='column' gap='none' align='left'>
                        <Text size='large' style={{ fontWeight: 'bolder' }}>{cardSet.displayName}</Text>
                        <Text size='small' color={cardSet.getBonus() == 0 ? 'grey' : ''}>{cardSet.getBonusText()}</Text>
                    </Box>
                </Box>                
                <Box direction='row' gap='small' align='center'>
                    <Grid columns={{ size: 'auto', count: 5 }} gap='small'>
                        {
                            cardSet.cards?.map((card, index) => <CardBox key={index} card={card} />)
                        }
                    </Grid>
                </Box>
            </Box>            
        </ShadowBox>
    )
}

function CardsDisplay() {
    const [cards, setCardsData] = useState<Card[]>();
    const cardSets = CardSet.fromBase(initCardSetRepo(), cards) as CardSet[];
    const appContext = useContext(AppContext);

    useEffect(() => {
        if (appContext) {
            const theData = appContext.data.getData();
            setCardsData(theData.get("cards"));
            cardSets.forEach(cardSet => {cardSet.cards = (cards) ? cards.filter(card => card.data.category == cardSet.cardSetName) : []});
        }
    }, [appContext, cardSets, cards])

    if (!cards || !cardSets) {
        return null;
    }

    return (
        <Box gap='medium'>
            <NextSeo title="Cards" />
            <Heading level='2' size='medium' style={{ fontWeight: 'normal' }}>Cards</Heading>
            <Grid columns={{ size: 'auto', count: 1 }} gap='medium'>
                {
                    cardSets?.map((cardSet, index) => <CardSetBox key={index} cardSet={cardSet}/>)
                }
            </Grid>
        </Box>
    )
}

export default CardsDisplay;