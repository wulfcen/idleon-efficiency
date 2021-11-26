import {
    Box,
    Table,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
    Heading,
    Text,
    Grid,
    ResponsiveContext
} from 'grommet'
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../data/appContext'
import { NextSeo } from 'next-seo';

import { Trap } from '../data/domain/traps';
import ShadowBox from '../components/base/ShadowBox';

interface PlayerTrapProps {
    traps: Array<Trap>
}

function PlayerTraps(props: PlayerTrapProps) {
    const size = useContext(ResponsiveContext)
    const formatTime = (input: number) => {
        const formatter = new Intl.RelativeTimeFormat('en');
        const ranges: Record<string, number> = {
            years: 3600 * 24 * 365,
            months: 3600 * 24 * 30,
            weeks: 3600 * 24 * 7,
            days: 3600 * 24,
            hours: 3600,
            minutes: 60,
            seconds: 1
        };
        for (let key in ranges) {
            if (ranges[key] < Math.abs(input)) {
                const delta = input / ranges[key];
                return formatter.format(Math.round(delta), key as Intl.RelativeTimeFormatUnit);
            }
        }
    }

    return (
        <Grid columns={{count: 6, size: ["50px", "16.666666666666666666666666666667%"]}} gap="small" justify="start">
            {
                props.traps.map((trap, index) => {
                    return (
                        <Box key={`trap_${index}`} style={{ background: trap.isReady() ? 'red' : 'none' }} align="center">
                            <Box width={{max: size == "small" ? '30px': '50px'}} >
                                <Box title={`Total Duration: ${formatTime(trap.trapDuration)?.replace("in ", "") ?? ""}`} className={`icons-3636 icons-${trap.critterName}_x1`} />
                            </Box>
                            <Text textAlign='center' size="xsmall">{formatTime(trap.trapDuration - trap.timeSincePut)}</Text>
                        </Box>
                    )
                })
            }
        </Grid>
    )
}

function Traps() {
    const [playerTraps, setPlayerTraps] = useState<Array<Array<Trap>>>(Array<Array<Trap>>());
    const [playerNames, setPlayerNames] = useState<Array<string>>([]);
    const idleonData = useContext(AppContext);

    useEffect(() => {
        if (idleonData) {
            const theData = idleonData.getData();
            setPlayerTraps(theData.get("traps"));
            setPlayerNames(theData.get("playerNames"))
        }
    }, [idleonData]);

    if (!playerTraps || playerTraps.filter(x => playerNames[x[0]?.playerID] != undefined).length == 0) {
        return (
            <Box align="center" pad="medium">
                <Heading level='3'>Come back when you unlocked this!</Heading>
            </Box>
        )
    }
    return (
        <Box>
            <NextSeo title="Traps" />
            <Heading level="2" size="medium" style={{ fontWeight: 'normal' }}>Traps</Heading>
            <ShadowBox background="dark-1" pad="large">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell >Player Name</TableCell >
                            <TableCell >Traps</TableCell >
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            playerTraps.filter(x => playerNames[x[0]?.playerID] != undefined).map((trapsData, index) => {
                                return (
                                    <TableRow key={`traps_${index}`}>
                                        <TableCell>{playerNames[trapsData[0]?.playerID]}</TableCell>
                                        <TableCell>
                                            <PlayerTraps traps={trapsData} />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </ShadowBox>
        </Box>
    )
}

export default Traps;