// @flow

import React from 'react'
import {MINUTES} from 'data/constants'
import {isMultiple, toggleDateType, toOptions, rangeHoursToSingle} from 'utils'
import range from 'lodash/range'
import MultipleSwitcher from './MultipleSwitcher'
import TimeInput from './components/TimeInput'
import DateComponent, {DayOfWeek, DayOfMonth, Month} from './components/DateComponent'
import PresetTab from './PresetTab'
import type {PresetTabState} from './types/PresetTabState'
import type {PresetTabProps} from './types/PresetTabProps'

const minutesOptions = toOptions(range(0, 60));
const hoursOptions = toOptions(range(0, 24));

const isMinutes = (activeTime: string) => activeTime === MINUTES;

export default class PeriodicallyTab extends PresetTab {
    constructor(props: PresetTabProps, ctx: Object) {
        super(props, ctx);
        const {hours} = this.state;
        this.state.hours = rangeHoursToSingle(hours)
    }


    toggleActiveTime = () => {
        this.setState(({activeTime}: PresetTabState) => ({
            activeTime: toggleDateType(activeTime)
        }))
    };

    isMultiple = () => {
        const {activeTime, minutesMultiple, hoursMultiple} = this.state;
        if(activeTime === MINUTES) {
            return minutesMultiple
        } else {
            return hoursMultiple
        }
    };

    getMinutes = () => {
        const {minutes} = this.state;
        if (this.isMultiple(minutes) && minutes instanceof Array) {
            return minutes.map(minute => minutesOptions.filter(option => option.value === minute)[0])
        }

        return minutesOptions.filter(option => option.value === minutes)[0]
    }

    getHours = () => {
        const {hours} = this.state;
        if (this.isMultiple(hours) && hours instanceof Array) {
            return hours.map(hour => hoursOptions.filter(option => option.value === hour)[0])
        }

        return hoursOptions.filter(option => option.value === hours)[0]
    }

    render() {
        const {styleNameFactory} = this.props;
        const {activeTime, minutes, hours, dayOfWeek, dayOfMonth, month} = this.state;
        return (
            <div {...styleNameFactory('preset')} >
                <div>
                    <MultipleSwitcher
                        styleNameFactory={styleNameFactory}
                        isMultiple={this.isMultiple()}
                        onChange={this.changeDateType}
                    />
                    <div
                        {...styleNameFactory('row', 'main')}
                    >
                        {isMinutes(activeTime) &&
                            <TimeInput
                                options={minutesOptions}
                                value={this.getMinutes()}
                                onChange={this.selectMinutes}
                                isMulti={isMultiple(minutes)}
                                isMenuOpen
                            />
                        }
                        {!isMinutes(activeTime) &&
                            <TimeInput
                                options={hoursOptions}
                                value={this.getHours()}
                                isMulti={isMultiple(hours)}
                                onChange={this.selectHours}
                                isMenuOpen
                            />
                        }
                        <div
                            style={{width: 150}}
                        >
                            <MultipleSwitcher
                                styleNameFactory={styleNameFactory}
                                isMultiple={!isMinutes(activeTime)}
                                onChange={this.toggleActiveTime}
                                single="minutes"
                                multiple="hours"
                            />
                        </div>
                    </div>
                </div>
                <DateComponent
                    styleNameFactory={styleNameFactory}
                >
                    <DayOfWeek
                        value={dayOfWeek}
                        onChange={this.selectDayOfWeek}
                    />
                    <DayOfMonth
                        value={dayOfMonth}
                        onChange={this.selectDayOfMonth}
                    />
                    <Month
                        value={month}
                        onChange={this.selectMonth}
                    />
                </DateComponent>
            </div>
        )
    }
}
