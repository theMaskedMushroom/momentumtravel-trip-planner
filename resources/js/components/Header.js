import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class Header extends Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (<div className='navbar'>
                    <Link to='/'>Search for flights</Link>
                    <Link to='/trips'>See my trips</Link>
                </div>
        )
    }
}

export default Header;