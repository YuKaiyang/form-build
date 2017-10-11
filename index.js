/**
 * Created by ALIENWARE17 on 2016/8/15.
 */
import React from 'react'
import {render} from 'react-dom'
import Form from "react-jsonschema-form"

const myRender = (schema, uiSchema, formData, container) => {
	render((
		<Form schema={schema}
		      uiSchema={uiSchema}
		      formData={formData}
		/>
	), document.getElementById(container))
}
