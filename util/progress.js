/**
 * @file progress
 * @author ienix(enix@foxmail.com)
 *
 * @since 2017/4/17
 */

const ORA = require('ora');

const SPINNER =  [
    'dots', 'dots2', 'dots3', 'dots4', 'dots5',
    'dots6', 'dots7', 'dots8', 'dots9', 'dots10',
    'dots11', 'dots12', 'line', 'line2', 'pipe',
    'simpleDots', 'simpleDotsScrolling', 'star',
    'star2', 'flip', 'hamburger', 'growVertical',
    'growHorizontal', 'balloon', 'balloon2', 'noise',
    'bounce', 'boxBounce', 'boxBounce2', 'triangle',
    'arc', 'circle', 'squareCorners', 'circleQuarters',
    'circleHalves', 'squish', 'toggle', 'toggle2',
    'toggle3', 'toggle4', 'toggle5', 'toggle6', 'toggle7',
    'toggle8', 'toggle9', 'toggle10', 'toggle11',
    'toggle12', 'toggle13', 'arrow', 'arrow2',
    'arrow3', 'bouncingBar', 'bouncingBall',
    'smiley', 'monkey', 'hearts', 'clock',
    'earth', 'moon', 'runner', 'pong', 'shark', 'dqpb'
];

let random = (max = 0,  min = 0) => Math.floor(Math.random() * max + min);

let setProps = function(option = {}) {
    Object.assign({}, this, option);

    return this;
};

let set = function(key, value = '') {
    this[key] = value;

    return this;
};

let progress = (option) => {
    let config = {
        spinner: SPINNER[random(SPINNER.length, 0)],
        color: 'yellow'
    };

    if (typeof option === 'string') {
        config = option;
    }
    else {
        config = Object.assign({}, config, option);
    }

    let spinner = ORA(config);

    spinner.set = set.bind(spinner);
    spinner.setProps = setProps.bind(spinner);

    return spinner;
};

module.exports = progress;
