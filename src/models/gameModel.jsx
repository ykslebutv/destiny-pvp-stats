import { extendObservable, action } from 'mobx';

import destiny2 from '../destiny2';
import { Status } from '../constants';

class GameModel {
    constructor(args) {

        extendObservable(this, {

            activityId: args.activityId,

            data: {},

            status: Status.NODATA,
            error: null,
            loadingPage: false,

            setStatus: action(status => {
                this.status = status;
            }),

            setData: action(data => {
                this.data = data;
            }),

            setError: action(error => {
                this.setStatus(Status.FAILED);
                this.error = error;
            })
        });
    }

    get loading() {
        return this.status === Status.LOADING;
    }

    get success() {
        return this.status === Status.SUCCESS;
    }

    get failed() {
        return this.status === Status.FAILED;
    }

    load() {
        this.setStatus(Status.LOADING);
        destiny2.getPostGame(this.activityId).then(data => {
            this.setData(data);
            this.setStatus(Status.SUCCESS);
        }, error => {
            this.setError(error);
        });
    }
}

export default GameModel;
