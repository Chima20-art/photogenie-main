import 'package:equatable/equatable.dart';

class Caroussel extends Equatable {
  final String name;
  final String imageUrl;

  const Caroussel({required this.name, required this.imageUrl});

  @override
  List<Object?> get props => [imageUrl, name];

  static List<Caroussel> carroussels = [
    const Caroussel(
      name: 'Food Love',
      imageUrl:
          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3Mzk3NzQwNA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    ),
    const Caroussel(
      name: 'Animals lovers',
      imageUrl:
          'https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3NzAzMjk2OQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    ),
    const Caroussel(
      name: 'Holiday',
      imageUrl:
          'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3MzkwMTM5MA&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    ),
    const Caroussel(
      name: 'Madagascar',
      imageUrl:
          'https://images.unsplash.com/photo-1585335740623-f7a1f0c446eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY3MzkyMjMwMg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    ),
  ];
}
