import React, { useState } from "react";
import { Star } from '@material-ui/icons'
import { Box, makeStyles } from '@material-ui/core'

const useStyle = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '60px',
		width: 'max-content'
    },
    radio: {
        display: 'none'
    },
    rating: {
        cursor: 'pointer'
    }
})

const Rate = () => {
const [rate, setRate] = useState(0);
const classes = useStyle()
return (
	<Box className={classes.container}>
	{[...Array(5)].map((item, index) => {
		const givenRating = index + 1;
		return (
		<label>
			<input
            className={classes.radio}
			type="radio"
			value={givenRating}
			onClick={() => {
				setRate(givenRating);
			}}
			/>
			<Box className={classes.rating}>
			<Star style={{color: givenRating < rate || givenRating === rate ? '#000' : '#bbb'}}
			/>
			</Box>
		</label>
		);
	})}
	</Box>
);
};

export default Rate;
