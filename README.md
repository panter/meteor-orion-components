# meteor-orion-components

While `orionjs:pages` provides an easy way to define different page-templates by attaching a schema, cms-editors often a more flexible way to structure a page.

This package therefore enables developers to define "components" that editors can add to a page. 


**Work in progress, api may change**

## Usage

`meteor add panter:orion-components`

You can now register a component:

````
orion.components.registerComponent("title_text_image", {
	title: "Component with title, text and an image",
	templateFrontend: "component_title_text_image",
	schema: new SimpleSchema({
		title: {
			type: String,
			label: "Title"
		},
		text: orion.attribute('froala', {
			label: 'BoxText'
		}),
		image: orion.attribute("image", {label: "Image"})
	})
});

````

And define a template for it:

``````
<template name="component_title_text_image">
	<div class="component_title_text_image">
		<h2>{{title}}</h2>
		<img src="{{image.url}}" />
		{{{text}}}
	</div>
</template>

``````

You can then define a property on a page-schema (or another entity) that can contain an array of these components. 
Consider this page-template:

`````
// js-file

orion.pages.addTemplate({
	layout: 'layout',
	template: 'page_with_components',
	name: 'Page with components',
	description: 'A page that contains multiple components in its content-area'
}, {
	title: {
		type: String,
		label: "Page title",
	},
	intro: orion.attribute('froala', {
		optional: true,
		label: 'Intro-text'
	}),
	contentArea: {
		optional: true,
		type: orion.components.components({
			label: "Content-area", 
			optional: true,
			allowedComponents: ["title_text_image"] // optional, restrict to allowed components
		}),
	}
});

// spacebars-template:
<template name="page_with_components">
	<div class="page_with_components">
		<h1>{{title}}</h1>
		<div class="intro">
			{{{intro}}}
		</div>
		<div class="content">
			{{>orion_components_frontend_components contentArea}}
		</div>
	</div>
</template>

````

`orion_components_frontend_components` is a helper provided by this package that iterates over every component in the passed property and render its frontent-template.

If you need more control, use this:

`````
	<div class="content">
	  {{#each contentArea.components
		  {{>orion_components_frontend_component}}
		{{/each}}
	</div>
`````

E.g. you can use this together with `panter:slick-blaze` to create a carousel where each slide may be completly different in structure and content:

`````
<template name="page_carousel">
	{{#with carouselArea}}
	<div class="carousel">
		{{#slick}}
			{{#each components}}
			<div>
				{{>orion_components_frontend_component}}
				</div>
			{{/each}}
		{{/slick}}
	</div>
	{{/with}}
</template>
````

## TODO / Issues

- [] use orion.attributes instead of define the type `type: orion.components.components({...})` in schemas
- [] removing a component may be buggy (issue seems related to aldeed:autoform)
- [] slow performance in admin-area because of re-rendering on changes. 
