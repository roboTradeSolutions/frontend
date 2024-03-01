import { Box, Grid, Heading, List, ListItem, Skeleton } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';

import type { StatsChartsSection } from 'types/api/stats';
import type { StatsIntervalIds } from 'types/client/stats';

import useApiQuery from 'lib/api/useApiQuery';
import { apos } from 'lib/html-entities';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import IconSvg from 'ui/shared/IconSvg';

import ChartsLoadingErrorAlert from './ChartsLoadingErrorAlert';
import ChartWidgetContainer from './ChartWidgetContainer';

type Props = {
  filterQuery: string;
  isError: boolean;
  isPlaceholderData: boolean;
  charts?: Array<StatsChartsSection>;
  interval: StatsIntervalIds;
}

const ChartsWidgetsList = ({ filterQuery, isError, isPlaceholderData, charts, interval }: Props) => {
  const [ isSomeChartLoadingError, setIsSomeChartLoadingError ] = useState(false);
  const isAnyChartDisplayed = charts?.some((section) => section.charts.length > 0);
  const isEmptyChartList = Boolean(filterQuery) && !isAnyChartDisplayed;

  const homeStatsQuery = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const handleChartLoadingError = useCallback(
    () => setIsSomeChartLoadingError(true),
    [ setIsSomeChartLoadingError ]);

  if (isError) {
    return <ChartsLoadingErrorAlert/>;
  }

  if (isEmptyChartList) {
    return <EmptySearchResult text={ `Couldn${ apos }t find a chart that matches your filter query.` }/>;
  }

  return (
    <Box>
      { isSomeChartLoadingError && (
        <ChartsLoadingErrorAlert/>
      ) }

      <List>
        {
          charts?.map((section) => (
            <ListItem
              key={ section.id }
              mb={ 8 }
              _last={{
                marginBottom: 0,
              }}
            >
              <Skeleton isLoaded={ !isPlaceholderData } mb={ 4 } display="inline-flex" alignItems="center" columnGap={ 2 } id={ section.id }>
                <Heading size="md" >
                  { section.title.replace('ETH', '8Bit') }
                </Heading>
                { section.id === 'gas' && homeStatsQuery.data && homeStatsQuery.data.gas_prices && (
                  <GasInfoTooltip data={ homeStatsQuery.data } dataUpdatedAt={ homeStatsQuery.dataUpdatedAt }>
                    <IconSvg name="info" boxSize={ 5 } display="block" cursor="pointer" _hover={{ color: 'link_hovered' }}/>
                  </GasInfoTooltip>
                ) }
              </Skeleton>

              <Grid
                templateColumns={{ lg: 'repeat(2, minmax(0, 1fr))' }}
                gap={ 4 }
              >
                { section.charts.map((chart) => (
                  <ChartWidgetContainer
                    key={ chart.id }
                    id={ chart.id }
                    title={ chart.title.replace('ETH', '8Bit') }
                    description={ chart.description.replace('ETH', '8Bit') }
                    interval={ interval }
                    units={ chart.units || undefined }
                    isPlaceholderData={ isPlaceholderData }
                    onLoadingError={ handleChartLoadingError }
                  />
                )) }
              </Grid>
            </ListItem>
          ))
        }
      </List>
    </Box>
  );
};

export default ChartsWidgetsList;
