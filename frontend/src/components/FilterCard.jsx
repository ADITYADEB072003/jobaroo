import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';

const FilterCard = ({ onSalarySelect }) => {
    const [selectedValue, setSelectedValue] = useState('');
    const [expanded, setExpanded] = useState({});
    const dispatch = useDispatch();
    const { allJobs } = useSelector(store => store.job);

    // Build the filter data dynamically based on job details
    const filterData = {
        Location: [...new Set(allJobs.map(job => job.location))],
        Industry: [...new Set(allJobs.map(job => job.title))],
        Salary: [...new Set(allJobs.map(job => job.salary))],
        Company: [...new Set(allJobs.map(job => job.company?.name))].filter(Boolean)
    };

    const changeHandler = (value) => {
        setSelectedValue(value);
        dispatch(setSearchedQuery(value));
    };

    const toggleExpand = (category) => {
        setExpanded(prevState => ({ ...prevState, [category]: !prevState[category] }));
    };

    const clearFilter = () => {
        setSelectedValue('');
        dispatch(setSearchedQuery(''));
    };

    const handleSalaryChange = (value) => {
        setSelectedValue(value);
        onSalarySelect(value); // Pass selected salary to parent component (Jobs)
    };

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <div className='flex items-center justify-between'>
                <h1 className='font-bold text-lg pr-5'>Filter Jobs</h1>
                {selectedValue && (
                    <button 
                        onClick={clearFilter} 
                        className='bg-red-500 text-white px-4 py-1 rounded-md'
                    >
                        Clear
                    </button>
                )}
            </div>
            <hr className='mt-3' />
            <div className="filter-scroll-container" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
                <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                    {
                        Object.entries(filterData).map(([category, items]) => (
                            <div key={category}>
                                <h1 className='font-bold text-lg'>{category}</h1>
                                {
                                    items.slice(0, expanded[category] ? items.length : 5).map((item, idx) => (
                                        <div key={`${category}-${idx}`} className='flex items-center space-x-2 my-2'>
                                            <RadioGroupItem 
                                                value={item} 
                                                id={`${category}-${idx}`} 
                                                onChange={() => category === 'Salary' && handleSalaryChange(item)} // Handle salary filter
                                            />
                                            <Label htmlFor={`${category}-${idx}`}>{item}</Label>
                                        </div>
                                    ))
                                }
                                {
                                    items.length > 5 && (
                                        <button
                                            onClick={() => toggleExpand(category)}
                                            className='text-blue-500 text-sm'
                                        >
                                            {expanded[category] ? 'Show less' : `+${items.length - 5} more`}
                                        </button>
                                    )
                                }
                            </div>
                        ))
                    }
                </RadioGroup>
            </div>
        </div>
    );
};

export default FilterCard;
