
orion.components = {
	registerComponent(id, definition) {
		definition.id = id;
		this.definitions[id] = definition;
	},
	getDefinition(id){
		return this.definitions[id];
	},
	definitions: {},
	definitionsOptions({allowedComponents = null}) {
		let definitions = _.keys(this.definitions);
		if(_.isArray(allowedComponents)){
			definitions = _.intersection(definitions, allowedComponents);
		}
		return definitions.map((id) => {return {label: this.definitions[id].title, value: id}});
	},
	components({label = "Components", allowedComponents = null, optional = true}) {
		return new SimpleSchema({
			components: {
				type: [Object],
				label: label,
				optional: optional,
				
			},
			"components.$.definitionId": {
				type: String,
				autoform: {
					options(){
						return orion.components.definitionsOptions({allowedComponents});
					}
				}
			},
			"components.$.data": {
				autoform: {
					panelClass: "component"
				},
				type: orion.components.schemaComponentData({allowedComponents}),

			},
		});
	},
	schemaComponentData({allowedComponents}) {

		let allCompomentsSchema = {};
		let definitions = _.keys(this.definitions);
		if(_.isArray(allowedComponents)){
			definitions = _.intersection(definitions, allowedComponents);
		}

		for(let id of definitions) {
			
			allCompomentsSchema[id] = {
				type: this.definitions[id].schema,
				optional: true,
				
				autoform: {

					panelClass: function(){

						let fieldName = this.name;
						let [component, ___, ...prefix] = fieldName.split(".").reverse();
						
						// workaround:
						// AutoForm.getFieldValue(definitionField) will invalidate computations
						// even if the value has not changed
						// we "debounce" this by creating a reactive var that stores the value
						let templateInstance = Template.instance();
						if(!templateInstance._componentDefinitionId) {
							let definitionField = `${prefix.reverse().join(".")}.definitionId`;
							templateInstance._componentDefinitionId = new ReactiveVar();
							Tracker.nonreactive(function(){
								templateInstance.autorun(function(){
									templateInstance._componentDefinitionId.set(AutoForm.getFieldValue(definitionField));
								});
							});
							
						}

						let definition = templateInstance._componentDefinitionId.get();
						
						return definition === component ? "component-definition component-definition-selected" : "component-definition component-definition-not-selected"
						//return "component-definition component-definition-selected";
					}
				}
			};
		}
		return new SimpleSchema(allCompomentsSchema);
	}
}



if(Meteor.isClient) {
	Template.orion_components_frontend_component.helpers({
		data() {
			return this.data[this.definitionId];
		},
		definition(){
			let definition = orion.components.getDefinition(this.definitionId);
			return definition;
		}
	});
}




