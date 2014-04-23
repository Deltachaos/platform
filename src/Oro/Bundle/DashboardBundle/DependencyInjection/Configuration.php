<?php

namespace Oro\Bundle\DashboardBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    const UNSPECIFIED_POSITION = 9999;

    /**
     * {@inheritDoc}
     *
     * @SuppressWarnings(PHPMD.ExcessiveMethodLength)
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $treeBuilder->root('oro_dashboard')
            ->children()
                ->arrayNode('widgets')
                    ->info('Configuration of widgets')
                    ->useAttributeAsKey('name')
                    ->prototype('array')
                        ->ignoreExtraKeys()
                        ->children()
                            ->scalarNode('label')
                                ->info('The label name for widget title')
                                ->cannotBeEmpty()
                            ->end()
                            ->scalarNode('icon')
                                ->info('Path to icon')
                            ->end()
                            ->scalarNode('description')
                                ->info('translatable description')
                            ->end()
                            ->scalarNode('route')
                                ->info('The route name of a controller responsible to render a widget')
                                ->isRequired()
                                ->cannotBeEmpty()
                            ->end()
                            ->arrayNode('route_parameters')
                                ->info('Additional parameters for the route. "widget" parameter is added automatically')
                                ->useAttributeAsKey('name')
                                ->prototype('scalar')
                                ->end()
                            ->end()
                            ->scalarNode('acl')
                                ->info('The ACL ancestor')
                                ->cannotBeEmpty()
                            ->end()
                            ->arrayNode('items')
                                ->info('A list of additional items for "itemized" widgets')
                                ->useAttributeAsKey('name')
                                ->prototype('array')
                                    ->ignoreExtraKeys()
                                    ->children()
                                        ->scalarNode('label')
                                            ->info('The label name for item')
                                            ->isRequired()
                                            ->cannotBeEmpty()
                                        ->end()
                                        ->scalarNode('icon')
                                            ->info('The name of item icon. Use only icon name without "icon-" prefix')
                                            ->cannotBeEmpty()
                                        ->end()
                                        ->scalarNode('route')
                                            ->info('The redirect route name')
                                            ->isRequired()
                                            ->cannotBeEmpty()
                                        ->end()
                                        ->arrayNode('route_parameters')
                                            ->info('Additional parameters for the route')
                                            ->useAttributeAsKey('name')
                                            ->prototype('scalar')
                                            ->end()
                                        ->end()
                                        ->scalarNode('acl')
                                            ->info('The ACL ancestor')
                                            ->cannotBeEmpty()
                                        ->end()
                                        ->integerNode('position')
                                            ->info('The position in which an item is rendered')
                                            ->cannotBeEmpty()
                                            ->defaultValue(self::UNSPECIFIED_POSITION)
                                        ->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
                ->arrayNode('dashboards')
                    ->info('Configuration of dashboards')
                    ->useAttributeAsKey('name')
                    ->prototype('array')
                        ->children()
                            ->scalarNode('twig')
                                ->info(
                                    'The name of TWIG template.'
                                    . ' Default template is "OroDashboardBundle:Index:default.html.twig"'
                                )
                                ->cannotBeEmpty()
                            ->end()
                        ->end()
                    ->end()
                ->end()
                ->scalarNode('default_dashboard')
                    ->info('The name of a dashboard which is displayed by default')
                    ->defaultValue('main')
                ->end()
            ->end();

        return $treeBuilder;
    }
}
