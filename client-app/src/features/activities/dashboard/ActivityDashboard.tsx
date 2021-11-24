//our Activity Dashboard is goning to be a react component,so we need to
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
// import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/stores/store';
import ActivityList from '../dashboard/ActivityList';
// import ActivityDetails from '../details/ActivityDetails';
// import ActivityForm from '../form/ActivityForm';
import ActivityFilters from '../dashboard/ActivityFilters';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';

//specify an intyerface for properties,this will be standard for any component we create.
// interface Props {
//     activities: Activity[];
//     //createOrEdit: (activity: Activity) => void;
//     deleteActivity: (id: string) => void;
//     submitting: boolean;
// }
//destructure the activities property itself
export default observer(function ActivityDashboard() {

    //Mobx
    const { activityStore } = useStore();
    //destructure the properties that we need from activityStore
    //const { selectedActivity, editMode } = activityStore;
    const { loadActivities, activityRegistry, setPagingParams, pagination } = activityStore;//modified 242

    //242
    const [loadingNext, setLoadingNext] = useState(false);

    //242
    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {

        //activityStore.loadActivities();
        if (activityRegistry.size === 0) loadActivities();//when initializing activityRegistery inside ActivityStore is gonna be zero

    }, [activityRegistry.size, loadActivities])//pass in the activity store as a dependncy to use effect here as well

    //if (activityStore.loadingInitial && !loadingNext) return <LoadingComponent content='Loading activities...' />//modified 242-247

    return (
        <Grid>
            <Grid.Column width='10'>
                {/* </List> */
                    //modified 243

                    //modified 247
                    activityStore.loadingInitial && !loadingNext ? (
                        <>
                            <ActivityListItemPlaceholder />
                            <ActivityListItemPlaceholder />
                        </>
                    )
                        : (
                            <InfiniteScroll
                                pageStart={0}
                                loadMore={handleGetNext}
                                hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                                initialLoad={false}
                            >
                                <ActivityList />
                            </InfiniteScroll>
                        )
                }


                {/* // activities={activities}
                // deleteActivity={deleteActivity}
                // submitting={submitting} */}

            </Grid.Column>
            <Grid.Column width='6'>
                {/* View activity  */}
                {/*we don't need to show the activity on the right hand*/}
                {/* {selectedActivity && !editMode &&
                    <ActivityDetails />
                }
                {
                    editMode &&
                    <ActivityForm />
                    // createOrEdit={createOrEdit}
                    // submitting={submitting} />
                } */}

                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>

        </Grid>
    )
})